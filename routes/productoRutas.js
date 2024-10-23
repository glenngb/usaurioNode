const express = require('express');
const router = express.Router()
const productoControlador = require('../controllers/productoControlador');

router.get('/', productoControlador.obtenerProductos);
router.get('/:id', productoControlador.obtenerProducto);
router.post('/', productoControlador.crearProducto);
router.post('/:id/actualizar', productoControlador.actualizarProducto); // Actualizar
router.post('/:id/eliminar', productoControlador.eliminarProducto); // Eliminar

module.exports = router;