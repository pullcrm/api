import { Sequelize } from 'sequelize'
import 'dotenv/config'

export const mysql = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
})
