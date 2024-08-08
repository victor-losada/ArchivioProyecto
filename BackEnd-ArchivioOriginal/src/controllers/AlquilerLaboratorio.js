import { param } from "express-validator";
import { conexion } from "../database/conexion.js";

export const postAlquiler = async (req, res) => {
    try{
        let {fecha_alquiler,fk_usuarios,estado,fecha_fin} = req.body
        let sql = `insert into alquileres (fecha_alquiler,fk_usuarios,estado,fecha_fin)
        values (?,?,?,?)`

        const [respuesta] = await conexion.query(sql,[fecha_alquiler,fk_usuarios,estado,fecha_fin])

        if(respuesta.affectedRows>0){
            res.status(200).json({message: 'laboratorio reservado con exito'})
        }
        else{
            res.status(400).json({message: 'error al hacer la reserva'})
        }
        
    }catch(error){
        res.status(500).json({message: 'error en el servidor' + error})
    }
}  

export const getAlquiler = async(req, res) =>{
    try{    
        let sql = 'select * from alquileres'

        const [respuesta] = await conexion.query(sql)
        res.status(200).json(respuesta)
    }catch(error){
        res.status(500).json({message: 'error en el servidor' + error})
    }
    
}
export const getAlquilerId = async(req, res) =>{
    try{    
        let id_alquiler = req.params.id_alquiler
        let sql = 'select * from alquileres where id_alquiler = ?'

        const [respuesta] = await conexion.query(sql,[id_alquiler])
        if(respuesta.length ===1){
            res.status(200).json(respuesta)
        }
        else {
            res.status(400).json({message: 'No existe este alquiler'})
        }

    }catch(error){
        res.status(500).json({message: 'error en el servidor' + error})
    }
    
}
export const patchAlquiler = async(req, res) => {
    try{
        let id_alquiler = req.params.id_alquiler
        let sql = `update alquileres set fecha-alquiler= ?, fecha_fin = ? where id_alquiler = ? `

        const [respuesta] = await conexion.query(sql, [fecha_alquiler,fecha_fin, id_alquiler])

        if(respuesta.affectedRows>0){
            res.status(200).json({message: 'Reserva actualizada con exito'})
        }
        else{
            res.status(400).json({message: 'no se pudo actualizar '})
        }
    }catch(error){
        res.status(500).json({message: 'error en el servidor' + error.message})
    }
}
export const deleteAlquiler = async(req, res) => {
    try{
        let id_alquiler = req.params.id_alquiler
        let sql = `delete from alquileres where id_alquiler = ? `

        const [respuesta] = await conexion.query(sql, [id_alquiler])

        if(respuesta.affectedRows>0){
            res.status(200).json({message: 'Reserva eliminada con exito'})
        }
        else{
            res.status(400).json({message: 'no se pudo eliminar la reserva '})
        }
    }catch(error){
        res.status(500).json({message: 'error en el servidor' + error.message})
    }
}