const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controllers/usuarioControlador');

router.get('/', usuarioControlador.obtenerUsuarios);
router.get('/:id', usuarioControlador.obtenerUsuario);
router.post('/', usuarioControlador.crearUsuario);
router.post('/:id/actualizar', usuarioControlador.actualizarUsuario); // Actualizar
router.post('/:id/eliminar', usuarioControlador.eliminarUsuario); // Eliminar
router.get('/:id/editar', usuarioControlador.mostrarFormularioEditarUsuario);

module.exports = router;
