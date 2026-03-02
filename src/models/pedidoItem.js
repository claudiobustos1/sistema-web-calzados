const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const PedidoItem = sequelize.define('PedidoItem', {
  id_itemPedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_inventario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioxUni: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}
);

module.exports = PedidoItem;