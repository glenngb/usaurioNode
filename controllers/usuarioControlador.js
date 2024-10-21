const usuarioServicio = require('../services/usuarioServicio');
const Usuario = require('../models/Usuario');

const obtenerUsuarios = async (req, res) => {
  const usuarios = await usuarioServicio.obtenerTodosLosUsuarios();
  res.render('usuario/index', {usuarios});
};

const obtenerUsuario = async (req, res) => {
  const usuario = await usuarioServicio.obtenerUsuarioPorId(req.params.id);
  res.render('usuarios/detalle', { usuario });
};

const crearUsuario = async (req, res) => {
  const { nombre, rut, correo, rol } = req.body;
  await usuarioServicio.crearUsuario({ nombre, rut, correo, rol });
  res.redirect('/usuarios');
};

const actualizarUsuario= async (req, res) => {
  await usuarioServicio.actualizarUsuario(req.params.id, req.body);
  res.redirect('/usuarios');
};

const eliminarUsuario = async (req, res) => {
  await usuarioServicio.eliminarUsuario(req.params.id);
  res.redirect('/usuarios');
};

const mostrarFormularioEditarUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) {
    return res.status(404).send('Usuario no encontrado');
  }
  res.render('usuarios/editarUsuario', { usuario });
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  mostrarFormularioEditarUsuario
};
