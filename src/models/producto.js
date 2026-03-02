const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
}
);

module.exports = Producto;