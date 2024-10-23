const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Producto = sequelize.define('producto', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    inventario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING,
    },
});

module.exports = Producto;
