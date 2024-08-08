import { conexion } from "../../database/conexion.js";
import { io } from "../Notification.js";

export const verDocs = async  (req, res) => {
    try {
        let sql = "SELECT * FROM procesos_soporte";
        const [documentos] = await conexion.query(sql);
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
};
export const obtenerGestiones = async(req, res) => {
    try{
        const {categoria, categoria2} = req.params
        let sql = `select * from procesos_soporte where categoria = ? and categoria2 = ?`

        const [documentos] = await conexion.query(sql,[categoria,categoria2])
        res.status(200).json(documentos)
    }catch(error){
        res.status(500).json({message: 'Error en el servidor' + error})
    }
}


export const subirDocs = async (req, res) => {
    try {
        let {  categoria, categoria2, nombre_documento, descripcion, formato,  fecha_carga } = req.body;
        let documento = req.file ? req.file.filename : null;

        const { id_usuario, rol_usuario, nombre_usuario} = req.user

        if(!id_usuario){
            return res.status(400).json({message: 'el id de usuario no fue proporcionado'})
        }

        let estado = rol_usuario == 'administrador'  ? 'activo'  : 'pendiente'


        let sql = `INSERT INTO procesos_soporte (fk_id_usuario, categoria, categoria2, nombre_documento, descripcion, formato, estado, fecha_carga, documento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [id_usuario, categoria, categoria2, nombre_documento, descripcion, formato, estado, fecha_carga, documento];
        const [respuesta] = await conexion.query(sql, values);

        if (respuesta.affectedRows > 0) {
            const id_soporte = respuesta.insertId
            let notificacionMessage = ''
            let notificacionRol = ''
            let notificacionUsuarioId = null

            if(rol_usuario == 'encargado'){
                notificacionMessage = `el encargado ${nombre_usuario} ha subido un documento pendiente de aprobar : ${nombre_documento}`
                notificacionRol= 'administrador'

                const [adminResult] = await conexion.query('select id_usuario from usuarios where rol_usuario = ?', ['administrador'])

                if(adminResult.length>0){
                notificacionUsuarioId = adminResult[0].id_usuario
                }

                io.emit('notificacionAdministrador',{
                    message: notificacionMessage,
                    id_soporte
                })
            }
            else if(rol_usuario === 'administrador'){
                notificacionMessage = `el administrador ${nombre_usuario} ha cargado un nuevo documento: ${nombre_documento}`
                notificacionRol = 'encargado'

                const [encargadoResult] = await conexion.query('select id_usuario from usuarios where rol_usuario =?',['encargado'])
                if(encargadoResult.length>0){
                    notificacionUsuarioId = encargadoResult[0].id_usuario
            }

            io.emit('notificacionEncargado',{
                message: notificacionMessage,
                id_soporte
            })
        }
        if(notificacionMessage && notificacionUsuarioId){
            const sqlNotificacion = `insert into notificaciones (titulo, body, rol,leido, fk_id_usuarios)
            values (?, ?, ?, ?, ?)`
            const NotificacionValue = [nombre_documento,notificacionMessage,notificacionRol, false,notificacionUsuarioId]
            await conexion.query(sqlNotificacion, NotificacionValue)
        }
            
            res.status(200).json({ message: 'documento cargado con exito', estado, notificacionRol});
        } else {
            res.status(400).json({ message: 'no se pudo cargar el documento' });
        }
    } catch (error) {
        res.status(500).json({ message: 'error en el servidor: ' + error.message });
    }
};

export const estatusDocumento = async (req, res)=> {

    const {nombre_usuario} = req.res
    const {id_soporte} = req.params
    const {accion} = req.body

    const estados = {
        aprobar: 'activo',
        rechazar: 'inactivo'
    }
    
    try{
       const sql = 'select estado, fk_id_usuario, nombre_documento from procesos_soporte where id_soporte = ?'
       const [estadoresult] = await conexion.query(sql,[id_soporte])

       if(estadoresult.length === 0){
        return res.status(404).json({message: 'documento no encontrado'})
       }

       const documento = estadoresult[0]

       if(documento.estado !== 'pendiente'){
        return res.status(400).json({message: 'documento ya ha sido procesado'})
       }

       const NewEstado = estados[accion]

       const actualizarSql = `update procesos_soporte set estado = ? where id_soporte = ?`

       await conexion.query(actualizarSql,[NewEstado, id_soporte])
       const titulo = 'Documento Procesado';
       const mensajeNotificacion = 
           accion === 'aprobar' 
           ? `El documento "${documento.nombre_documento}" ha sido aprobado.`
           : `El documento "${documento.nombre_documento}" ha sido rechazado.`;

       const NotificacionEncargado = `
           INSERT INTO notificaciones (titulo, body, rol, leido, fk_id_usuarios, creado_en)
           VALUES (?, ?, 'encargado', false, ?, NOW())
       `;
       await conexion.query(NotificacionEncargado, [titulo, mensajeNotificacion, documento.fk_id_usuario]);

       return res.status(200).json({ 
           message: `Documento ${accion}ado correctamente`,
           titulo,
           body: mensajeNotificacion,
           destinatario:nombre_usuario,
           estado_documento: NewEstado
       });
   } catch (error) {
       console.error("Error en el servidor:", error);
       return res.status(500).json({ message: 'Error en el servidor' + error.message });
   }
};

export const actualizarPrSoporte = async(req, res) => {
    try {
        let { id_soporte } = req.params;
        const { fk_id_usuario, categoria, categoria2, nombre_documento, descripcion, formato, estado, fecha_carga } = req.body;
        let documento = req.body.documento || null;

        if (req.file) {
            documento = req.file.filename;
        }

        let sql = `UPDATE procesos_soporte SET fk_id_usuario = ?, categoria = ?, categoria2 = ?, nombre_documento = ?, descripcion = ?, formato = ?, estado = ?, fecha_carga = ?, documento = ? WHERE id_soporte = ?`;

        const values = [fk_id_usuario, categoria, categoria2, nombre_documento, descripcion, formato, estado, fecha_carga, documento, id_soporte];

        const [resultado] = await conexion.query(sql, values);

        if (resultado.affectedRows > 0) {
            res.status(200).json({ message: 'Documento actualizado con éxito' });
        } else {
            res.status(400).json({ message: 'No se pudo actualizar el documento' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
}

export const eliminarPrSoporte = async (req, res) => {
    try {
        let { id_soporte } = req.params;

        let sql = `DELETE FROM procesos_soporte WHERE id_soporte = ?`;

        const [resultado] = await conexion.query(sql, [id_soporte]);

        if (resultado.affectedRows > 0) {
            res.status(200).json({ message: 'Documento eliminado con éxito' });
        } else {
            res.status(400).json({ message: 'No se pudo eliminar el documento' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
}
