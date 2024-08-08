import { Router } from "express"
import { documentosEvaluacion, documentosGestiones, documentosModulos } from "../controllers/ConsultasDocumentsController.js"
import upload from '../multer/multer.js'
import { actualizarPrEvaluacion, eliminarPrEvaluacion, estadoDocumento, obtenerDocs, obtenerEvaluacionIndependiente, obtenerMejora, subrDocs } from "../controllers/ProcesosEvaluacion/DocController.js"
import { actualizarPrSoporte, eliminarPrSoporte, estatusDocumento, obtenerGestiones, subirDocs, verDocs } from "../controllers/ProcesosSoporte/DocumentController.js"
import { actualizarPrEstrategicos, aprobarDocumento, cargaDocs, eliminarPrEstrategicos, getPorCategoria, getRecursoFinaciero, obtenerTodosLosDocs } from "../controllers/Procesosestrategicos/DocsController.js"
import {  actualizarPrMisionales, eliminarPrMisionales, estdoDocumento, getDocs, getDocsGestionComercial, getDocsXcategory, postDocs } from "../controllers/ProcesosMisionales/DocuController.js"
import { validarToken, verificarRol } from "../controllers/Authentication.js"

const documentosRouter = Router()

            // DOCUMENTOS GENERALES
documentosRouter.get('/obtener/modulo',validarToken,verificarRol(['administrador']), documentosModulos)
            // DOCUMENTOS PROCESOS EVALUACION
documentosRouter.get('/ver/procesosevaluacion',validarToken, verificarRol(['administrador']), obtenerDocs)
documentosRouter.get('/verdocs/procesosevaluacion',validarToken, verificarRol(["administrador","encargado","invitado"]), documentosEvaluacion)
documentosRouter.post('/cargar/procesosevaluacion',validarToken, verificarRol(['administrador', 'encargado']),  upload.single('documento'), subrDocs)
documentosRouter.put('/put/estadosdocu/:id_evaluacion',validarToken, verificarRol(['administrador']),  estadoDocumento)
documentosRouter.get('/ver/procesosevaluacion/:categoria',validarToken, verificarRol(['administrador','encargado','invitado']),  obtenerEvaluacionIndependiente)
documentosRouter.get('/ver/procesosevaluacion/:categoria/:categoria2',validarToken,verificarRol(['administrador','encargado','invitado']),  obtenerMejora)
documentosRouter.put('/put/procesosevaluacion/:id_evaluacion',validarToken,verificarRol(['administrador']), upload.single('documento') ,  actualizarPrEvaluacion)
documentosRouter.delete('/eliminar/procesosevaluacion/:id_evaluacion',validarToken,verificarRol(['administrador']),  eliminarPrEvaluacion);


            // DOCUMENTOS PROCESOS SOPORTE
 documentosRouter.get('/obtener/gestiones',validarToken,verificarRol(['administrador']), documentosGestiones)

documentosRouter.get('/ver/procesossoporte',validarToken,verificarRol(['administrador']), verDocs)
documentosRouter.post('/cargar/procesossoporte',validarToken, verificarRol(['administrador','encargado']), upload.single('documento'), subirDocs)
documentosRouter.put('/put/soporte/:id_soporte',validarToken, verificarRol(['administrador']), estatusDocumento )
documentosRouter.get('/ver/procesossoporte/:categoria/:categoria2',validarToken, verificarRol(['administrador','encargado','invitado']),  obtenerGestiones)
documentosRouter.put('/put/procesossoporte/:id_soporte',validarToken,verificarRol(['administrador']), upload.single('documento'),  actualizarPrSoporte)
documentosRouter.delete('/eliminar/procesossoporte/:id_soporte',validarToken,verificarRol(['administrador']),  eliminarPrSoporte);


            // DOCUMENTOS PROCESOS ESTRATEGICOS
documentosRouter.get('/ver/procesosestrategicos',validarToken, verificarRol(['administrador']), obtenerTodosLosDocs)
documentosRouter.get('/get/procesosestrategicos/:categoria',validarToken, verificarRol(['administrador','encargado','invitado']),  getRecursoFinaciero)
documentosRouter.get('/ver/procesosestrategicos/:categoria/:categoria2',validarToken, verificarRol(['administrador','encargado','invitado']),  getPorCategoria)
documentosRouter.post('/cargar/procesosestrategicos',validarToken, verificarRol(['administrador','encargado']), upload.single('documento'),  cargaDocs)
documentosRouter.put('/put/aprobarDoc/:id_docprocesos',validarToken, verificarRol(['administrador']),  aprobarDocumento)
documentosRouter.put('/put/procesosestrategicos/:id_docprocesos',validarToken,verificarRol(['administrador']), upload.single('documento'),  actualizarPrEstrategicos)
documentosRouter.delete('/eliminar/procesosestrategicos/:id_docprocesos',validarToken, verificarRol(['administrador']), eliminarPrEstrategicos);


            // DOCUMENTOS PROCESOS MISIONALES
documentosRouter.get('/ver/procesosmisionales',validarToken, verificarRol(['administrador']), getDocs)
documentosRouter.get('/ver/procesosmisionales/:categoria',validarToken, verificarRol(['administrador','encargado','invitado']),  getDocsGestionComercial)
documentosRouter.get('/ver/procesosmisionales/:categoria/:categoria2',validarToken, verificarRol(['administrador','encargado','invitado']),  getDocsXcategory)
documentosRouter.post('/cargar/procesosmisionales',validarToken,  verificarRol(['administrador','encargado']),  upload.single('documento'), postDocs)
documentosRouter.put('/misionales/:id_misionales',validarToken, verificarRol(['administrador']),  estdoDocumento)

documentosRouter.put('/put/procesosmisionales/:id_misionales',validarToken, verificarRol(['administrador']), upload.single('documento'),  actualizarPrMisionales)
documentosRouter.delete('/eliminar/procesosmisionales/:id_soporte',validarToken, verificarRol(['administrador']),  eliminarPrMisionales);
 

export default documentosRouter