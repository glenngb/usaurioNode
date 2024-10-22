const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Usuario = sequelize.define('usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rut: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
  },
  rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[0, 1, 2]],
    },
  },


});

module.exports = Usuario;
