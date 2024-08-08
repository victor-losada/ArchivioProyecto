import { Router } from "express";
import { validarUsuarios } from "../controllers/LoginController.js";
import { validarToken, verificarRol } from "../controllers/Authentication.js";


const loginUser = Router()

loginUser.post('/loginAdmin',validarUsuarios)
loginUser.get('/tokenValidate',validarToken)

export default loginUser