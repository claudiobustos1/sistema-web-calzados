const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  empresa: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}
);

module.exports = Proveedor;