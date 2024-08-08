import { conexion } from "../../database/conexion.js";
import { io } from "../Notification.js";

export const obtenerTodosLosDocs = async (req, res) => {
    try {
        let sql = "SELECT * FROM docprocesos";
        const [documentos] = await conexion.query(sql);
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
};

export const getPorCategoria = async (req, res) => {
    const { categoria, categoria2 } = req.params; 

    try {
        const sql = "SELECT * FROM docprocesos WHERE categoria = ? AND categoria2 = ?";
        const [documentos] = await conexion.query(sql, [categoria, categoria2]);
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
};
export const getRecursoFinaciero = async (req, res) => {
    const { categoria } = req.params; 

    try {
        const sql = "SELECT * FROM docprocesos WHERE categoria = ? ";
        const [documentos] = await conexion.query(sql, [categoria]);
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
};



export const actualizarPrEstrategicos = async(req, res) => {
    try {
        let { id_docprocesos } = req.params;
        const { fk_id_usuario, categoria, categoria2, nombre_documento, descripcion, formato, estado, fecha_carga } = req.body;
        let documento = req.body.documento || null;

        if (req.file) {
            documento = req.file.filename;
        }

        let sql = `UPDATE docprocesos SET fk_id_usuario = ?, categoria = ?, categoria2 = ?, nombre_documento = ?, descripcion = ?, formato = ?, estado = ?, fecha_carga = ?, documento = ? WHERE id_docprocesos = ?`;

        const values = [fk_id_usuario, categoria, categoria2, nombre_documento, descripcion, formato, estado, fecha_carga, documento, id_docprocesos];

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
export const eliminarPrEstrategicos = async (req, res) => {
    try {
        let { id_docprocesos } = req.params;

        let sql = `DELETE FROM docprocesos WHERE id_docprocesos = ?`;

        const [resultado] = await conexion.query(sql, [id_docprocesos]);

        if (resultado.affectedRows > 0) {
            res.status(200).json({ message: 'Documento eliminado con éxito' });
        } else {
            res.status(400).json({ message: 'No se pudo eliminar el documento' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
}

export const cargaDocs = async (req, res) => {
    try {
        let { categoria, categoria2, nombre_documento, descripcion, formato, fecha_carga } = req.body;
        let documento = req.file ? req.file.filename : null;

        const { id_usuario, rol_usuario, nombre_usuario } = req.user;

     
        if (!id_usuario) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado' });
        }

        if (rol_usuario !== 'encargado' && rol_usuario !== 'administrador') {
            return res.status(400).json({ message: 'Usuario no autorizado' });
        }

        let estado = rol_usuario === 'administrador' ? 'activo' : 'pendiente';

        let sql = `INSERT INTO docprocesos (fk_id_usuario, categoria, categoria2, nombre_documento, descripcion, formato, estado, fecha_carga, documento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [id_usuario, categoria, categoria2, nombre_documento, descripcion, formato, estado, fecha_carga, documento];
        const [respuesta] = await conexion.query(sql, values);

        if (respuesta.affectedRows > 0) {
            const id_docprocesos = respuesta.insertId;
            let notificacionMessage = '';
            let notificacionRol = '';
            let notificacionUsuarioId = null;

            if (rol_usuario === 'encargado') {
                notificacionMessage = `El encargado ${nombre_usuario} ha subido un documento pendiente de aprobar: ${nombre_documento}`;
                notificacionRol = 'administrador';

                const [adminResult] = await conexion.query('SELECT id_usuario FROM usuarios WHERE rol_usuario = ?', ['administrador']);
                if (adminResult.length > 0) {
                    notificacionUsuarioId = adminResult[0].id_usuario;
                }

                io.emit('notificacionAdministrador', {
                    message: notificacionMessage,
                    id_docprocesos
                });
            }
            else if (rol_usuario === 'administrador') {
                notificacionMessage = `El administrador ${nombre_usuario} ha cargado un nuevo documento: ${nombre_documento}`;
                notificacionRol = 'encargado';

                const [encargadoResult] = await conexion.query('SELECT id_usuario FROM usuarios WHERE rol_usuario = ?', ['encargado']);
                if (encargadoResult.length > 0) {
                    notificacionUsuarioId = encargadoResult[0].id_usuario;
                }

                io.emit('notificacionEncargado', {
                    message: notificacionMessage,
                    id_docprocesos
                });
            }

            if (notificacionMessage && notificacionUsuarioId) {
                const notificacionSql = `INSERT INTO notificaciones (titulo, body, rol, leido, fk_id_usuarios)
                    VALUES (?, ?, ?, ?, ?)`;
                const notificacionValues = [nombre_documento, notificacionMessage, notificacionRol, false, notificacionUsuarioId];
                await conexion.query(notificacionSql, notificacionValues);
            }

            res.status(200).json({ message: 'Documento cargado con éxito', estado, notificacionRol });
        } else {
            res.status(400).json({ message: 'No se pudo cargar el documento' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
};

export const aprobarDocumento = async (req, res) => {
    const {nombre_usuario} = req.user
    const { id_docprocesos } = req.params;
    const { accion } = req.body; 

    const estados = { 
        aprobar: 'activo',
        rechazar: 'inactivo'
    };
 // mapeo de acciones a estados👆
    try {
      
        const sql = `SELECT estado, fk_id_usuario, nombre_documento FROM docprocesos WHERE id_docprocesos = ?`;
        const [resultadoDocumento] = await conexion.query(sql, [id_docprocesos]);

        if (resultadoDocumento.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const documento = resultadoDocumento[0];
        
        if (documento.estado !== 'pendiente') {
            return res.status(400).json({ message: 'El documento ya ha sido procesado' });
        }

        const nuevoEstado = estados[accion];
     // Actualizar el estado del documento👆

        const sqlActualizar = `UPDATE docprocesos SET estado = ? WHERE id_docprocesos = ?`;
        await conexion.query(sqlActualizar, [nuevoEstado, id_docprocesos]);

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
            estado_documento: nuevoEstado
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ message: 'Error en el servidor' + error.message });
    }
};







