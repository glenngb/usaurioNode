const usuarioServicio = require('../services/usuarioServicio');
const Usuario = require('../models/Usuario');

const obtenerUsuarios = async (req, res) =>  {
  const usuarios = await usuarioServicio.obtenerTodosLosUsuarios();
  res.render('usuario/index', {usuarios});
};

const obtenerUsuario = async (req, res) => {
  const usuario = await usuarioServicio.obtenerUsuarioPorId(req.params.id);
  res.render('usuarios/detalle', { usuario });
};

const crearUsuario = async (req, res) => {
  const { nombre, rut, correo, pass, rol } = req.body;

  // Convertir el rol a su valor numérico
  let rolNumerico;
  if (rol === 'admin') {
      rolNumerico = 1;
  } else if (rol === 'user') {
      rolNumerico = 0;
  } else if (rol === 'vendor') {
      rolNumerico = 2;
  }

  try {
      // Crear el usuario en la base de datos
      await usuarioServicio.crearUsuario({
          nombre,
          rut,
          correo,
          pass, 
          rol: rolNumerico, 
      });

      // Redirigir a la lista de usuarios después de la creación
      res.redirect('/usuarios');
  } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).send('Error al crear el usuario');
  }
};



// Controlador para actualizar el usuario
const actualizarUsuario = async (req, res) => {
  const { id, nombre, rut, correo, rol } = req.body;

  // Convertir el rol a su valor numérico
  let rolNumerico;
  if (rol === 'admin') {
      rolNumerico = 1;
  } else if (rol === 'user') {
      rolNumerico = 0;
  } else if (rol === 'vendor') {
      rolNumerico = 2;
  }

  try {
      // Actualizar el usuario en la base de datos con los valores recibidos
      await Usuario.update(
          {
              nombre,
              rut,
              correo,
              rol: rolNumerico,
          },
          { where: { id } }
      );

      // Redirigir o mostrar un mensaje de éxito
      res.redirect('/usuarios'); 
  } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).send('Error al actualizar el usuario');
  }
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
