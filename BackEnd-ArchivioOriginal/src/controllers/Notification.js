
import { Server } from 'socket.io';

let io;
const userSockets = {}; 


const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*',    
        }
    });

      io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado');
        socket.on('registerUser', (user) => {
            userSockets[user.id] = { socket, role: user.role }; // Registrar el usuario y su socket
        });
        socket.on('disconnect', () => {
            console.log('Un usuario se ha desconectado');
            for (let id in userSockets) {
                if (userSockets[id].socket === socket) {
                    delete userSockets[id];
                    break;
                }
            }
        });
    });

    return io;
};
const notifyAdministradores = (message) => {
    for(let id_usuario in userSockets ){
        if(userSockets[id_usuario].role === 'administrador'){
            userSockets[id_usuario].emit('notificacionAdministrador', message);

    }
}
}
const notifyEncargados = (message) => {
    for(let id_usuario in userSockets ){
        if(userSockets[id_usuario].role === 'encargado'){
            userSockets[id_usuario].emit('notificacionEncargado', message);

    }
}
}

export { initSocket,notifyAdministradores,notifyEncargados, io };
