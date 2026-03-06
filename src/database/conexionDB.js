const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME ,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false,
    define: { timestamps: false },
  }
);

module.exports = sequelize;
