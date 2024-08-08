import { validationResult } from "express-validator";
import { conexion } from "../database/conexion.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
export const validarUsuarios = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }

        let { numero_identificacion, contraseña_usuario } = req.body;

        let sql = `SELECT id_usuario, nombre_usuario, rol_usuario, contraseña_usuario FROM usuarios WHERE numero_identificacion='${numero_identificacion}'`;
        const [resultado] = await conexion.query(sql);
        console.log("Resultado de la consulta:", resultado);

        if (resultado.length > 0) {
            const user = resultado[0];
            const storedPasswordHash = user.contraseña_usuario;
            console.log("Contraseña almacenada:", storedPasswordHash);

            // comparación de la contraseña proporcionada con el hash almacenado en la base de datos
            const passwordMatch = await bcryptjs.compare(contraseña_usuario, storedPasswordHash);
            console.log("Resultado de la comparación de contraseñas:", passwordMatch);

            if (passwordMatch) {
                let token = jwt.sign({ id_usuario: user.id_usuario, nombre_usuario: user.nombre_usuario, rol_usuario: user.rol_usuario }, process.env.SECRET, { expiresIn: process.env.TIME });
                return res.status(200).json({ user: { id_usuario: user.id_usuario, nombre_usuario: user.nombre_usuario, rol_usuario: user.rol_usuario }, token, message: 'Usuario ingresado con éxito' });
            } else {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
}