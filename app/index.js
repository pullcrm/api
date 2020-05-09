import bodyParser from 'body-parser'
import express from 'express'
import api from './routes'
import 'dotenv/config'
import logger from 'morgan'
import {errorsHandler} from './middlewares/errors'
import './models'

const prefix = '/api'
const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:8080']
  const origin = req.headers.origin

  if(allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Forwarded-For, Content-Type, Accept, Authorization, Country, user-id')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')

  next()
})

app.use(prefix, api)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  errorsHandler(err, res)
})

export default app
