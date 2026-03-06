const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Inventario = sequelize.define('Inventario', {
  id_inventario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_producto: { type: DataTypes.INTEGER, allowNull: false },
  talle: { type: DataTypes.INTEGER, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  indexes: [
    { unique: true, fields: ['id_producto', 'talle'] } // evita duplicados por producto+talle
  ],
  timestamps: false,
  tableName: 'Inventarios'
});

module.exports = Inventario;