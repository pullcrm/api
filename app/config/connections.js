const {Sequelize} = require('sequelize')
require('dotenv/config')

const mysql = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  logging: false,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    timezone: "local",
  },
  //TODO add timezone after creation
  timezone: 'Europe/Kiev',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
})

module.exports = {mysql}