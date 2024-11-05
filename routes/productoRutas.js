const express = require('express');
const router = express.Router()
const productoControlador = require('../controllers/productoControlador');
const upload = require('../middlewares/upload')

router.get('/', productoControlador.obtenerProductos);
router.get('/:id', productoControlador.obtenerProducto);
//router.post('/:id/actualizar', productoControlador.actualizarProducto); // Actualizar
router.post('/:id/eliminar', productoControlador.eliminarProducto); // Eliminar

//router.post('/', productoControlador.crearProducto);
router.post('/',upload.single('imagen'), productoControlador.crearProducto);
//router.post('/:id/actualizar', productoControlador.actualizarProducto);
router.post('/:id/actualizar',upload.single('imagen'), productoControlador.actualizarProducto);
module.exports = router;
