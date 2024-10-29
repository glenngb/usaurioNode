const express = require('express');
const router = express.Router();
const authControlador = require('../controllers/authControlador');




// Mostrar formulario de inicio de sesión
router.get('/login', authControlador.mostrarFormularioLogin);

// Procesar el inicio de sesión
router.post('/login', authControlador.iniciarSesion);




module.exports = router;
