const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB'); 

const Categoria = sequelize.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}
);

module.exports = Categoria;