
import { conexion } from "../database/conexion.js";


export const registrInvitado = async (req, res) => {
    try {
        let { nombre_usuario, apellido_usuario, Tipologia_usuario, numero_identificacion, 	tipo_documento, correo_electronico } = req.body;

        let contraseña_usuario = req.body.contraseña_usuario || '';
        let telefono_usuario = req.body.telefono_usuario || ''; 
        let rol_usuario = req.body.rol_usuario || 'invitado'; 

        let sql = `INSERT INTO usuarios (nombre_usuario, apellido_usuario, Tipologia_usuario, numero_identificacion, contraseña_usuario, correo_electronico, telefono_usuario, rol_usuario, tipo_documento) 
                    VALUES ('${nombre_usuario}','${apellido_usuario}', '${Tipologia_usuario}','${numero_identificacion}','${contraseña_usuario}','${correo_electronico}','${telefono_usuario}','${rol_usuario}','${tipo_documento}')`

        const [respuesta] = await conexion.query(sql);

        if (respuesta.affectedRows > 0) {
            res.status(200).json({ message: 'Invitado registrado con éxito' });
        } else {
            res.status(404).json({ message: 'Error al registrar el invitado' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
};
