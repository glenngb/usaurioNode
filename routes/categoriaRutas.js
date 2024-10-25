const express = require('express');
const router = express.Router();
const categoriaControlador = require('../controllers/categoriaControlador');

router.get('/', categoriaControlador.obtenerCategorias);
router.get('/:id', categoriaControlador.obtenerCategoria);
router.post('/', categoriaControlador.crearCategoria);
router.post('/:id/actualizar', categoriaControlador.actualizarCategoria);
router.post('/:id/eliminar', categoriaControlador.eliminarCategoria);

module.exports = router;
