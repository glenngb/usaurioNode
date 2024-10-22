const Usuario = require('../models/Usuario');

const obtenerTodosLosUsuarios = async () => {
  return await Usuario.findAll();
};

const obtenerUsuarioPorId = async (id) => {
  return await Usuario.findByPk(id);
};

const crearUsuario = async (datos) => {
  return await Usuario.create(datos);
};

const actualizarUsuario = async (id, datos) => {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    return await usuario.update(datos);
  }
  return null;
};

const eliminarUsuario = async (id) => {
  try {
      await Usuario.destroy({ where: { id } }); // Elimina el usuario con el ID proporcionado
  } catch (error) {
      throw error;
  }
};

module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
