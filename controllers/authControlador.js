const usuarioServicio = require('../services/usuarioServicio');
const bcrypt = require('bcrypt');

const mostrarFormularioRegistro = (req, res) => {
    res.render('auth/registro');
};

const registrarUsuario = async (req, res) => {
    const { nombre, rut, correo, pass, rol } = req.body;

    if (!nombre || !rut || !correo || !pass || !rol) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    // Convertir rol a numérico si está en texto
    const ROLES = { USER: 0, ADMIN: 1 };
    const rolNumerico = ROLES[rol.toUpperCase()] ?? 0; // Asignar valor predeterminado de rol

    try {
        await usuarioServicio.crearUsuario({
            nombre,
            rut,
            correo,
            pass,
            rol: rolNumerico,
        });
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
};

const mostrarFormularioLogin = (req, res) => {
    res.render('auth/login');
};

const iniciarSesion = async (req, res) => {
    const { correo, pass } = req.body;

    try {
        // Busca al usuario por correo
        const usuario = await Usuario.findOne({ where: { correo } });
        console.log("Usuario encontrado:", usuario); // Verifica que el usuario se encuentre

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verifica la contraseña
        const contrasenaValida = await bcrypt.compare(pass, usuario.pass);
        console.log("Contraseñas coinciden:", contrasenaValida); // Verifica la coincidencia

        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // Aquí se supone que configuras la sesión
        req.session.usuarioId = usuario.id; // Asegúrate de que req.session esté definido
        return res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};



module.exports = {
    mostrarFormularioRegistro,
    registrarUsuario,
    mostrarFormularioLogin,
    iniciarSesion,
};
