const express = require('express');
const router = express.Router();
const authControlador = require('../controllers/authControlador');




// Mostrar formulario de inicio de sesión
router.get('/login', authControlador.mostrarFormularioLogin);

// Procesar el inicio de sesión
router.post('/login', authControlador.iniciarSesion);

router.get('/login', (req, res) => {
    res.render('auth/login', { titulo: 'Iniciar Sesión' });
  });
  

  router.get('/logout',(req,res) =>{
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/login');
});




module.exports = router;
