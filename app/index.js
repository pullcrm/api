import http from 'http'
import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import api from './routes'
import 'dotenv/config'
import logger from 'morgan'
import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"
import {errorsHandler} from './middlewares/errors'
import './models'
import TelegramBot from './providers/telegram'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import SMSScheduler from './jobs/sms.scheduler'

dayjs.extend(customParseFormat)

const port = process.env.PORT || '3000'
const prefix = '/api'
const app = express()

SMSScheduler.init({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD
})

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

TelegramBot.launch()

app.use('/api', express.static('uploads'))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

const whitelist = ['capacitor://pullcrm.capacitor', 'http://pullcrm.capacitor', 'http://pullcrm.local:8080', 'https://dev.pullcrm.com', 'https://pullcrm.com']

const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin)
    // if (!origin || whitelist.indexOf(origin) !== -1) {
    callback(null, true)
    // } else {
    //   callback(new Error())
    // }
  }
}

app.use(cors(corsOptions))

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
  console.error(err)
})

server.on('error', e => console.log(e))

export default server

