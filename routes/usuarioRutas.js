const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controllers/usuarioControlador');

// Obtener todos los usuarios
router.get('/', usuarioControlador.obtenerUsuarios);

// Obtener un usuario específico
router.get('/:id', usuarioControlador.obtenerUsuario);

// Crear un nuevo usuario
router.post('/', usuarioControlador.crearUsuario);

// Actualizar un usuario existente
router.post('/:id/actualizar', usuarioControlador.actualizarUsuario);

// Eliminar un usuario
router.post('/:id/eliminar', usuarioControlador.eliminarUsuario);

// Mostrar formulario para editar un usuario
router.get('/:id/editar', usuarioControlador.mostrarFormularioEditarUsuario);

// Mostrar formulario para crear un comprador
router.get('/comprador/nuevo', usuarioControlador.mostrarFormularioCrearComprador); // Esta ruta es la correcta

// Crear un nuevo comprador
router.post('/comprador', usuarioControlador.crearComprador); // Esta ruta está bien

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
