import http from 'http'
import bodyParser from 'body-parser'
import express from 'express'
import multer from 'multer'
import mkdirp from 'mkdirp'
import api from './routes'
import 'dotenv/config'
import logger from 'morgan'
import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"
import {errorsHandler} from './middlewares/errors'
import './models'
import path from 'path'
import ApiException from './exceptions/api'
import sharp from 'sharp'
import fs from 'fs'

const port = process.env.PORT || '3000'
const prefix = '/api'
const app = express()

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENV,
  integrations: [
    new Sentry.Integrations.Http({tracing: true}),
    new Tracing.Integrations.Express({app}),
  ],
  tracesSampleRate: 1.0,
  ignoreErrors: [
    'TypeError: Failed to fetch',
    'TypeError: NetworkError when attempting to fetch resource.',
    'TypeError: Cancelled',
    'TypeError: cancelado',
  ],
  debug: false,
  initialScope: {
    level: 'info'
  }
})

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/' + Date.now()

    mkdirp(dir, err => cb(err, dir))
  },

  filename: (req, file, cb) => cb(null, file.originalname),
})

app.use('/api', express.static('uploads'))

app.post(prefix + '/files', multer({
  storage: storageConfig,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()

    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return cb(new ApiException(400, 'Only images are allowed'))
    }

    cb(null, true)
  },
}).single('file'), async (req, res, next) => {
  try {
    const img = await sharp(req.file.path)
      .resize(300)
      .jpeg()
      .toFile(path.resolve(req.file.destination, req.file.filename))

    req.file = {...req.file, ...img}
      
    // fs.unlinkSync(req.file.path)
  } catch(err) {
    console.log(err)
    next(new ApiException(400, 'File is damaged, try another'))
  }

  next()
})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

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

app.use(Sentry.Handlers.errorHandler())

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  errorsHandler(err, res)
})

const server = http
  .createServer(app)
  .listen(port)

process.on('uncaughtException', function( err ) {
  console.error(err.stack)
})

server.on('error', e => console.log(e))

export default server

