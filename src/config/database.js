const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'db_usuarios',
  process.env.POSTGRES_USER || 'postgres_user',
  process.env.POSTGRES_PASSWORD || 'postgres_password',
  {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

module.exports = sequelize;
