const express = require('express');
const router = express.Router();
const authControlador = require('../controllers/authControlador');

router.get('/tienda', (req, res) => {
  res.render('tienda/index'); // Esto debería renderizar tu archivo index.pug
});

module.exports = router;

