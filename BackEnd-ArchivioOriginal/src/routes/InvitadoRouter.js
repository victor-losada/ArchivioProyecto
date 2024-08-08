import { Router } from "express";
import { registrInvitado } from "../controllers/InvitadoController.js";


const regisInvitado = Router()

regisInvitado.post('/invitados', registrInvitado)

export default regisInvitado    