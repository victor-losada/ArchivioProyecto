import jwt from "jsonwebtoken";



export const validarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "Se requiere token" });
    }

    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
            console.error("Error al verificar el token:", error);
            return res.status(401).json({ message: "Token inválido" });
        }

        console.log("Token decodificado:", decoded);

        req.user = decoded;

        next(); 
    });
};
export const verificarRol = (rolesPermitidos) => {
                     // array como argumento👆
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        // para saber si el usuario esta autenticado👆
        const { rol_usuario } = req.user;

        if (rolesPermitidos.includes(rol_usuario)) {
            return next();
        } else {
            return res.status(403).json({ message: "Acceso denegado" });
        }
    };
};