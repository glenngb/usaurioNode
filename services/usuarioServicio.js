const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const obtenerTodosLosUsuarios = async () => {
  return await Usuario.findAll();
};

const obtenerUsuarioPorId = async (id) => {
  return await Usuario.findByPk(id);
};


const crearUsuario = async ({ nombre, rut, correo, pass, rol }) => {
  try {
   
    const hashedPassword = await bcrypt.hash(pass, 10);

    
    const nuevoUsuario = await Usuario.create({
      nombre,
      rut,
      correo,
      pass: hashedPassword, 
      rol
    });

    return nuevoUsuario; 
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
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
const obtenerUsuarioPorCorreo = async (correo) => {
  return await Usuario.findOne({ where: { correo } });
};

// Exportar el nuevo método
module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorCorreo, // Nueva función
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
