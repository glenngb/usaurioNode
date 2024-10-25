const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controllers/usuarioControlador');

router.get('/', usuarioControlador.obtenerUsuarios);
router.get('/:id', usuarioControlador.obtenerUsuario);
router.post('/', usuarioControlador.crearUsuario);
router.post('/:id/actualizar', usuarioControlador.actualizarUsuario); // Actualizar
router.post('/:id/eliminar', usuarioControlador.eliminarUsuario); // Eliminar
router.get('/:id/editar', usuarioControlador.mostrarFormularioEditarUsuario);

// Validaciones comentadas para activarlas posteriormente
 const { body, validationResult } = require('express-validator');
 router.post('/',
   body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
   body('email').isEmail().withMessage('El email no es válido'),
   (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     next();
   }
 );

module.exports = router;
