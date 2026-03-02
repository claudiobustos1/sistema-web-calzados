const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const CarritoItem = sequelize.define('CarritoItem', {
  id_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_carrito: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_inventario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}
);

module.exports = CarritoItem;