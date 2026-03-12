const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Cliente = sequelize.define('Cliente', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'No especificada' // Parche temporal para filas antiguas si las hay
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}
);

module.exports = Cliente;