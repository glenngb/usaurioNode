const productoServicio = require('../services/productoServicio');
const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) =>  {
    const productos = await productoServicio.obtenerTodosLosProductos();
    res.render('producto/index', {productos});
};

const obtenerProducto = async (req, res) => {
    const producto = await productoServicio.obtenerProductoPorId(req.params.id);
    res.render('productos/detalle', { producto });
};

const crearProducto = async (req, res) => {
    const { id, nombre, descripcion, precio, inventario, categoria } = req.body;

    try {
        // Crear el producto en la base de datos
        await productoServicio.crearProducto({
            id,
            nombre,
            descripcion,
            precio,
            inventario,
            categoria,
        });

        // Redirigir a la lista de productos después de la creación
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).send('Error al crear el producto');
    }
};



// Controlador para actualizar el producto
const actualizarProducto = async (req, res) => {
    const { id, nombre, descripcion, precio, inventario, categoria } = req.body;


    try {
        // Actualizar el producto en la base de datos con los valores recibidos
        await Producto.update(
            {
                nombre,
                descripcion,
                precio,
                inventario,
                categoria,
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