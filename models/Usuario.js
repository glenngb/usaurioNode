const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rut: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
 
});

module.exports = Usuario;
