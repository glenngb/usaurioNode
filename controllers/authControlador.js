const Usuario = require('../models/Usuario');
const usuarioServicio = require('../services/usuarioServicio');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importamos jsonwebtoken
const JWT_SECRET = 'tu_secreto'; // Usa una variable de entorno para el secreto en producción

// Muestra el formulario de inicio de sesión
const mostrarFormularioLogin = (req, res) => {
    res.render('auth/login');
};

// Maneja el inicio de sesión
const iniciarSesion = async (req, res) => {
    const { correo, pass } = req.body;
    req.session.usuario = {
        correo: correo
    }
    try {
        // Busca al usuario por correo
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            // Si el usuario no existe, redirige al login con mensaje de error
            return res.status(404).render('auth/login', { mensaje: 'Usuario no encontrado' });
        }

        // Verifica la contraseña
        const contrasenaValida = await bcrypt.compare(pass, usuario.pass);
        if (!contrasenaValida) {
            // Si la contraseña no es válida, redirige al login con mensaje de error
            return res.status(401).render('auth/login', { mensaje: 'Contraseña incorrecta' });
        }
   
        // Genera un token JWT con los datos del usuario
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
            JWT_SECRET,
            { expiresIn: '1h' } // El token expira en 1 hora

       
        );

        // Guarda el token en una cookie
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 }); // 1 hora
 


        // Redirige según el rol del usuario
        if (usuario.rol === 1) { // ADMIN
            return res.redirect('/dashboard');
        } else if (usuario.rol === 2) { // VENDOR
            return res.redirect('/dashboard');
        } else { // USER
            return res.redirect('/tienda');
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        // Redirige al formulario de login con un mensaje de error genérico
        return res.status(500).render('auth/login', { mensaje: 'Error interno del servidor' });
    }
};

// Middleware para validar el JWT en rutas protegidas
const autenticarJWT = (req, res, next) => {
    const token = req.cookies.token; // Obtiene el token de las cookies

    if (!token) {
        return res.status(403).redirect('/auth/login'); // Redirige si no hay token
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verifica el token
        req.user = decoded; // Almacena los datos del usuario en `req.user`
        next(); // Continúa con la siguiente función
    } catch (error) {
        console.error("Error al verificar el token:", error);
        return res.status(401).redirect('/auth/login'); // Redirige si el token es inválido
    }
};


// Cierra la sesión eliminando la cookie de JWT
const cerrarSesion = (req, res) => {
    res.clearCookie('token'); // Borra la cookie del token
    res.redirect('/auth/login'); // Redirige al login
};

module.exports = {
    mostrarFormularioLogin,
    iniciarSesion,
    autenticarJWT,
    cerrarSesion,
};
