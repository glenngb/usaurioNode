const Usuario = require('../models/Usuario');
const usuarioServicio = require('../services/usuarioServicio');
const bcrypt = require('bcrypt');

const mostrarFormularioLogin = (req, res) => {
    res.render('auth/login');
};

const iniciarSesion = async (req, res) => {
    const { correo, pass } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            // Redirige al formulario de login con un mensaje de error
            return res.status(404).render('auth/login', { mensaje: 'Usuario no encontrado' });
        }

        const contrasenaValida = await bcrypt.compare(pass, usuario.pass);

        if (!contrasenaValida) {
            // Redirige al formulario de login con un mensaje de error
            return res.status(401).render('auth/login', { mensaje: 'Contraseña incorrecta' });
        }
// Redirige según el rol del usuario
if (usuario.rol === 1) { // ADMIN
    return res.redirect('/dashboard');
} else if (usuario.rol === 2) { // VENDOR
    return res.redirect('/dashboard');
} else { // USER
    return res.redirect('/auth');
}
        // Si el inicio de sesión es exitoso, guarda el ID del usuario en la sesión
        req.session.usuarioId = usuario.id; // Asegúrate de que req.session esté definido correctamente

        // Redirige a la vista 'exito.pug'
        //return res.render('auth/exito', { titulo: 'Inicio de Sesión Exitoso' });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        // Redirige al formulario de login con un mensaje de error genérico
        return res.status(500).render('auth/login', { mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    mostrarFormularioLogin,
    iniciarSesion,
};
