const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USUARIO, process.env.DB_CONTRASENA, {
  host: process.env.DB_HOST,
  port: process.env.DB_PUERTO || 5432, 
  dialect: 'postgres',
});

const conectarBD = async () => {
  try {
    await sequelize.authenticate();
    console.log('Postgres conectado...');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, conectarBD };
