const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { conectarBD, sequelize } = require('./config/db');
const usuarioRutas = require('./routes/usuarioRutas');
const productoRutas = require('./routes/productoRutas');
const categoriaRutas = require('./routes/categoriaRutas');
const authRutas = require('./routes/authrutas'); // Importar las rutas de autenticación

dotenv.config();

const app = express();

// Conectar a la base de datos
conectarBD();

// Sincronizar modelos
sequelize.sync().then(() => {
  console.log('Modelos sincronizados con la base de datos.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sirviendo archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Configurar Pug como motor de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Bienvenido a la Tienda' });
});

// Ruta para renderizar el archivo Pug
app.get('/dashboard', (req, res) => {
  res.render('dashboard/index'); // La ruta relativa a la carpeta de vistas
});

// Rutas de usuarios, productos y categorías
app.use('/usuarios', usuarioRutas);
app.use('/productos', productoRutas);
app.use('/categorias', categoriaRutas);
app.use('/', authRutas); // Rutas de autenticación

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});
