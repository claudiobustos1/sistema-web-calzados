const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Carrito = sequelize.define('Carrito', {
  id_carrito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}
);

module.exports = Carrito;