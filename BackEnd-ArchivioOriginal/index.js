import express from "express";
import bodyParser from "body-parser"
import cors from "cors"; 
import dotenv from 'dotenv';
import http from 'http'; 
import { initSocket } from './src/controllers/Notification.js';

import Loginrouter from "./src/routes/LoginRouter.js"
import Usuarios from "./src/routes/UsuariosRouter.js"
import SesionInvitado from "./src/routes/InvitadoRouter.js"
import documents from './src/routes/DocumentsRouter.js'

dotenv.config();


const proyecto = express()
proyecto.use(bodyParser.json())
proyecto.use(bodyParser.urlencoded({extended: true}))


proyecto.use(cors())

proyecto.use(Loginrouter)
proyecto.use('/usuarios2',Usuarios)
proyecto.use( SesionInvitado)
proyecto.use('/documentos', documents)

// Crea un servidor HTTP con Express
const server = http.createServer(proyecto);
const io = initSocket(server);


const PORT = 3000
proyecto.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}` )
})
