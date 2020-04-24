import bodyParser from 'body-parser'
import express from 'express'
import api from './routes'
import 'dotenv/config'
import logger from 'morgan'
import {mysql} from './config/connections'
import { errorsHandler } from './middlewares/errors'
import './models'

const prefix = '/api'
const app = express()

app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Forwarded-For, Content-Type, Accept, Autorization, Country, user-id')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')

  next()
})

mysql.sync().then(() => {console.debug('Database sync executed correctly')})


app.use(prefix, api)
app.use(errorsHandler)

export default app
