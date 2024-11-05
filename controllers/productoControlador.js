const productoServicio = require('../services/productoServicio');
const categoriaServicio = require('../services/categoriaServicio');
const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) =>  {
    const productos = await productoServicio.obtenerTodosLosProductos();
    res.render('productos/index', {productos});
};

const obtenerProducto = async (req, res) => {
    const producto = await productoServicio.obtenerProductoPorId(req.params.id);
    res.render('productos/detalle', { producto });
};

const crearProducto = async (req, res) => {
    const { nombre, descripcion, precio, inventario, categoria } = req.body;
    const imagen = req.file ? req.file.path : null; // Obtiene la ruta de la imagen

 // Crear el producto en la base de datos
       
  await Producto.create({
    nombre,
    descripcion,
    precio,
    inventario,
    categoria,
    imagen, // Guarda la ruta de la imagen
  });
        // Redirigir a la lista de productos después de la creación
        res.redirect('/productos');
};



// Controlador para actualizar el producto
const actualizarProducto = async (req, res) => {
    const { id, nombre, descripcion, precio, inventario, categoria } = req.body;
    const imagen = req.file ? req.file.path : null; // Obtiene la ruta de la imagen


    try {
        // Actualizar el producto en la base de datos con los valores recibidos
        await Producto.update(
            {
                nombre,
                descripcion,
                precio,
                inventario,
                categoria,
                imagen, // Guarda la ruta de la imagen
            },
            { where: { id } }
        );

        // Redirigir o mostrar un mensaje de éxito
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto');
    }
};


const eliminarProducto = async (req, res) => {
    const { id } = req.params; // Captura el ID del producto desde la URL
    try {
        await productoServicio.eliminarProducto(id); // Llama al servicio para eliminar el producto
        res.status(200).json({ success: true, message: 'producto eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};

const mostrarFormularioEditarProducto = async (req, res) => {
    const producto = await producto.findByPk(req.params.id);
    if (!producto) {
        return res.status(404).send('producto no encontrado');
    }
    res.render('productos/editarProducto', { producto });
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    mostrarFormularioEditarProducto
};
