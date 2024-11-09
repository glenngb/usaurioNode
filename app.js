const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const { conectarBD, sequelize } = require('./config/db');

// Inicializa dotenv
dotenv.config();

const app = express();

// Conectar a la base de datos
conectarBD();

// Sincronizar modelos con la base de datos
sequelize.sync().then(() => {
  console.log('Modelos sincronizados con la base de datos.');
});

// Configuración de la sesión antes de cargar las rutas
app.use(
  session({
    secret: 'tu_secreto_de_sesion',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Middleware para compartir el usuario de la sesión con las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario;
  next();
});

// Middlewares para el parseo de datos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configuración del motor de vistas Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Importar rutas
const usuarioRutas = require('./routes/usuarioRutas');
const productoRutas = require('./routes/productoRutas');
const categoriaRutas = require('./routes/categoriaRutas');
const authRutas = require('./routes/authrutas');
const tiendaRutas = require('./routes/tiendaRutas');

// Rutas de la aplicación
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard/index');
});

app.get('/auth', (req, res) => {
  res.render('auth/index');
});

app.get('/tienda', async (req, res) => {
  try {
    const productos = await sequelize.query('SELECT * FROM productos', {
      type: sequelize.QueryTypes.SELECT
    });
    res.render('tienda/index', { productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('tienda/index', { productos: [] });  // Si no hay productos
  }
});

// Rutas de la aplicación
app.use('/usuarios', usuarioRutas);
app.use('/productos', productoRutas);
app.use('/categorias', categoriaRutas);
app.use('/', authRutas);

// Rutas de la API
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await sequelize.query('SELECT * FROM productos', { type: sequelize.QueryTypes.SELECT });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


// Ruta de inicio de sesión (controlador de autenticación)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Lógica de autenticación aquí (ejemplo de autenticación básica)
  if (email === 'test@example.com' && password === 'password') {
    req.session.usuario = { email };
    return res.json({ success: true, userEmail: email });
  }

  res.status(401).json({ success: false, message: 'Credenciales inválidas' });
});

// Configuración del puerto y lanzamiento del servidor
const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});

