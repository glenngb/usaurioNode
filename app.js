const express = require('express');
const session = require('express-session');
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

// Configura la sesión antes de las rutas
app.use(session({
    secret: 'tuSecreto', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sirviendo archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Configurar Pug como motor de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Bienvenido a la Tienda' });
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard/index');
});

// Rutas de usuarios, productos y categorías
app.use('/usuarios', usuarioRutas);
app.use('/productos', productoRutas);
app.use('/categorias', categoriaRutas);
app.use('/', authRutas); // Rutas de autenticación
// Usar las rutas de autenticación


const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});
