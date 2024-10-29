const Usuario = require('../models/Usuario');
const usuarioServicio = require('../services/usuarioServicio');
const bcrypt = require('bcrypt');

const mostrarFormularioRegistro = (req, res) => {
    res.render('auth/registro');
};


const mostrarFormularioLogin = (req, res) => {
    res.render('auth/login');
};

const iniciarSesion = async (req, res) => {
    const { correo, pass } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const contrasenaValida = await bcrypt.compare(pass, usuario.pass);

        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        req.session.usuarioId = usuario.id; // Asegúrate de que req.session esté definido
        return res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};




module.exports = {
    mostrarFormularioRegistro,
    mostrarFormularioLogin,
    iniciarSesion,
};
