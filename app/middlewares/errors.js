// import ApiException from '../exceptions/api'
// import {INTERNAL_SERVER_ERROR} from 'http-status'
// import {ERROR_HAPPEN} from '../constants/messages'

export const errorsHandler = (err, res) => {
  let message = err.message
  let status = err.status || 500

  if(err.name === 'SequelizeUniqueConstraintError') {
    message = Array.isArray(err.errors) && err.errors.map(E => E.message).join(';\n')
    status = 400
  }
  // if (!(err instanceof ApiException)) {
  //   message = ERROR_HAPPEN
  //   status = INTERNAL_SERVER_ERROR
  //
  //   console.log(err)
  //   // logger.error(`${ERROR_HAPPEN} => ${err.message}`)
  // }
  console.log(err)
  res.status(status).send({
    message,
    status
  })
}
