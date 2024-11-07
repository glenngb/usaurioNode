const Producto = require('../models/Producto');

const obtenerTodosLosProductos = async () => {
    try {
        return await Producto.findAll();
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw new Error('Error al obtener los productos');
    }
};

const obtenerProductoPorId = async (id) => {
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return producto;
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        throw new Error('Error al obtener el producto');
    }
};

const crearProducto = async (datos) => {
    try {
        return await Producto.create(datos);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        throw new Error('Error al crear el producto');
    }
};

const actualizarProducto = async (id, datos) => {
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return await producto.update(datos);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        throw new Error('Error al actualizar el producto');
    }
};

const eliminarProducto = async (id) => {
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        await Producto.destroy({ where: { id } });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        throw new Error('Error al eliminar el producto');
    }
};
module.exports = {
    obtenerTodosLosProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
};
