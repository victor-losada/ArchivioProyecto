import { Router } from "express";
import { actualizarUsuario, eliminarUsuario, listarUsuario, listarUsuarioId, registrarUsuario } from "../controllers/usuarioController.js";
import { validarToken, verificarRol } from "../controllers/Authentication.js";
const UsuarioRout= Router()

UsuarioRout.get('/listar',validarToken, verificarRol(["administrador"]), listarUsuario)
UsuarioRout.get('/listarid/:id_usuario',validarToken,verificarRol(["administrador"]),  listarUsuarioId)
UsuarioRout.post('/registros',validarToken,verificarRol(["administrador"]),  registrarUsuario)
UsuarioRout.delete('/eliminar/:id_usuario',validarToken, verificarRol(["administrador"]),   eliminarUsuario)
UsuarioRout.put('/actualizar/:id_usuario',validarToken,verificarRol(["administrador"]),  actualizarUsuario)



export default UsuarioRout      