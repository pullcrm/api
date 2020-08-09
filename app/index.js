import http from 'http'
import bodyParser from 'body-parser'
import express from 'express'
import multer from 'multer'
import mkdirp from 'mkdirp'
import api from './routes'
import 'dotenv/config'
import logger from 'morgan'
import {errorsHandler} from './middlewares/errors'
import './models'

const port = process.env.PORT || '3000'
const prefix = '/api'
const app = express()

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/' + Date.now()

    mkdirp(dir, err => cb(err, dir))
  },

  filename: (req, file, cb) => cb(null, file.originalname)
})

app.use('/api', express.static('uploads'))
app.use(multer({storage: storageConfig}).single('file'))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8000', 'http://pullcrm.com']
  const origin = req.headers.origin

  if(allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Forwarded-For, Content-Type, Accept, Authorization, Authorization2, Country, user-id')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')

  next()
})

app.use(prefix, api)

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  errorsHandler(err, res)
})

const server = http
  .createServer(app)
  .listen(port)

export default server
