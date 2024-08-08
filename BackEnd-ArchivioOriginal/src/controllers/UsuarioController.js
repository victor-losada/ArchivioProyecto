import {conexion} from '../database/conexion.js'
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';


export const listarUsuario = async (req,res)=>{
    try {
        let sql='select * from usuarios'
        const [resultado]= await conexion.query(sql)
        if(resultado.length>0){
            res.status(200).json(resultado)
        }else{
            res.status(404).json({message:'No se encontraron usuarios'})
        }
    } catch (error) {
        res.status(500).json({message:'Error en el servidor'+error.message})
    }

}

export const listarUsuarioId = async (req,res) => {
    try {
        let nombre_usuario = req.params.nombre_usuario
        let sql =`select * from usuarios where nombre_usuario=${nombre_usuario}`
        const [respuesta] = await conexion.query(sql)
        if(respuesta.length==1){
            res.status(200).json(respuesta)
        }else{
            res.status(404) .json({'message':'El usuario no existe'})
        }
    } catch (error) {
        res.status(500).json({message:'Error en el servidor'+error.message})
    }
}

export const registrarUsuario = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }

        let { nombre_usuario, apellido_usuario, correo_electronico, telefono_usuario, rol_usuario, contraseña_usuario, numero_identificacion, tipo_documento } = req.body;
        let Tipologia_usuario = req.body.Tipologia_usuario || '';

        const salt = await bcryptjs.genSalt(10);
        let hashPassword = await bcryptjs.hash(contraseña_usuario, salt);

        let sql = `INSERT INTO usuarios (nombre_usuario, apellido_usuario, correo_electronico, telefono_usuario, rol_usuario, Tipologia_usuario, contraseña_usuario, numero_identificacion, tipo_documento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [respuesta] = await conexion.query(sql, [nombre_usuario, apellido_usuario, correo_electronico, telefono_usuario, rol_usuario, Tipologia_usuario, hashPassword, numero_identificacion, tipo_documento]);

        if (respuesta.affectedRows > 0) {
            res.status(200).json({ message: 'Se registró el usuario con éxito' });
        } else {
            res.status(404).json({ message: 'No se pudo registrar el usuario' });
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
};

export const eliminarUsuario = async (req,res)=>{
    try {
        let id_usuario=req.params.id_usuario
        let sql=`delete from usuarios where id_usuario=${id_usuario}`
        const [respuesta]= await conexion.query(sql)
        if(respuesta.affectedRows>0){
            res.status(200).json({'message':'El usuario se elimiino con exito'})
        }else{
            res.status(404).json({'message':'Error'+error.message})
        }
    } catch (error) {
        res.status(500).json({'message':'Errror'+error.message})
    }
}
export const actualizarUsuario = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let id_usuario = req.params.id_usuario;
        let { nombre_usuario, apellido_usuario, correo_electronico, telefono_usuario, rol_usuario, numero_identificacion, tipo_documento } = req.body;

        // No incluir Tipologia_usuario y contraseña_usuario en la consulta SQL
        let sql = `UPDATE usuarios SET nombre_usuario=?, apellido_usuario=?, correo_electronico=?, telefono_usuario=?, rol_usuario=?, numero_identificacion=?, tipo_documento=? WHERE id_usuario=?`;

        // Ejecutar la consulta sin Tipologia_usuario y contraseña_usuario
        const [respuesta] = await conexion.query(sql, [nombre_usuario, apellido_usuario, correo_electronico, telefono_usuario, rol_usuario, numero_identificacion, tipo_documento, id_usuario]);

        if (respuesta.affectedRows > 0) {
            res.status(200).json({ message: 'Usuario actualizado' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};
