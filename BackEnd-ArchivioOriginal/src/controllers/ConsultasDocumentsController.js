import { conexion } from "../database/conexion.js";

export const documentosModulos = async (req,res) => {
    try{
        const sql = `SELECT 
                        usuarios.id_usuario,
                        usuarios.nombre_usuario,
                        usuarios.rol_usuario,
                        procesos_misionales.categoria2,
                        procesos_misionales.fecha_carga,
                        procesos_misionales.nombre_documento,
                        procesos_misionales.documento
                    FROM
                        procesos_misionales
                    JOIN
                        usuarios ON procesos_misionales.fk_id_usuario = usuarios.id_usuario
                    WHERE
                        procesos_misionales.fecha_carga >= DATE_SUB(CURDATE(), INTERVAL 2 DAY);`

        const [respuesta] = await conexion.query(sql)
        res.json(respuesta)
    }catch(error){
        console.log('error al obtener informacion' + error)
        res.status(500).json({message: ' error al obtener informacion'})
    }
}
export const documentosGestiones = async (req,res) => {
    try{
        const sql = `SELECT 
                        usuarios.id_usuario,
                        usuarios.nombre_usuario,
                        usuarios.rol_usuario,
                        procesos_soporte.categoria2,
                        procesos_soporte.fecha_carga,
                        procesos_soporte.nombre_documento,
                        procesos_soporte.documento
                    FROM
                        procesos_soporte
                    JOIN
                        usuarios ON procesos_soporte.fk_id_usuario = usuarios.id_usuario
                    WHERE
                        procesos_soporte.fecha_carga >= DATE_SUB(CURDATE(), INTERVAL 2 DAY);`

        const [respuesta] = await conexion.query(sql)
        res.json(respuesta)
    }catch(error){
        console.log('error al obtener informacion' + error)
        res.status(500).json({message: ' error al obtener informacion'})
    }
}
export const documentosEvaluacion = async (req,res) => {
    try{
        const sql = `SELECT 
                        usuarios.id_usuario,
                        usuarios.nombre_usuario,
                        usuarios.rol_usuario,
                        procesos_evaluacion.categoria2,
                        procesos_evaluacion.fecha_carga,
                        procesos_evaluacion.nombre_documento,
                        procesos_evaluacion.documento
                    FROM
                        procesos_evaluacion
                    JOIN
                        usuarios ON procesos_evaluacion.fk_id_usuario = usuarios.id_usuario
                    WHERE
                        procesos_evaluacion.fecha_carga >= DATE_SUB(CURDATE(), INTERVAL 2 DAY);`

        const [respuesta] = await conexion.query(sql)
        res.json(respuesta)
    }catch(error){
        console.log('error al obtener informacion' + error)
        res.status(500).json({message: ' error al obtener informacion'})
    }
}
