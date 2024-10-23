const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Usuario = sequelize.define('usuario', {
  id:{
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
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
    validate: {
      isIn: [[0, 1, 2]],
    },
  },


});

module.exports = Usuario;
