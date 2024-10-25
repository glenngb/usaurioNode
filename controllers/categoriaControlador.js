const categoriaServicio = require('../services/categoriaServicio');
const Producto = require('../models/Categorias');

const obtenerCategorias = async (req, res) => {
  const categorias = await categoriaServicio.obtenerTodoslasCategorias();
  res.render('categorias/index', { categorias });
};

const obtenerCategoria = async (req, res) => {
  const categoria = await categoriaServicio.obtenerCategoriaPorId(req.params.id);
  res.render('categorias/detalle', { categoria });
};

const crearCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;
  await categoriaServicio.crearCategoria({ nombre, descripcion});
  res.redirect('/categorias');
};

const eliminarCategoria = async (req, res) => {
  const { id } = req.params; // Captura el ID de la categoria desde la URL
  try {
      await categoriaServicio.eliminarCategoria(id); // Llama al servicio para eliminar la categoria
      res.status(200).json({ success: true, message: 'Categoria eliminada correctamente' });

  } catch (error) {
      console.error('Error al eliminar categoria:', error);
      res.status(500).json({ message: 'Error al eliminar el categoria' });
  }
};

// Controlador para actualizar el producto
const actualizarCategoria = async (req, res) => {
  const { id, nombre, descripcion} = req.body;


  try {
      // Actualizar el categoria en la base de datos con los valores recibidos
      await Producto.update(
          {
              nombre,
              descripcion,
          },
          { where: { id } }
      );

      // Redirigir o mostrar un mensaje de éxito
      res.redirect('/categorias');
  } catch (error) {
      console.error('Error al actualizar el categoria:', error);
      res.status(500).send('Error al actualizar la categoria');
  }
};

module.exports = {
  obtenerCategoria,
  obtenerCategorias,
  crearCategoria,
  eliminarCategoria,
  actualizarCategoria

};
