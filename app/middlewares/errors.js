// import ApiException from '../exceptions/api'
// import {INTERNAL_SERVER_ERROR} from 'http-status'
// import {ERROR_HAPPEN} from '../constants/messages'

import ValidationException from "../exceptions/validation"

export const errorsHandler = (err, res) => {
  let message = err.message
  let status = err.status || 500
  const code = err.code

  if(err.name === 'SequelizeUniqueConstraintError') {
    message = Array.isArray(err.errors) && err.errors.map(E => E.message).join(';\n')
    status = 400
  }

  if (err instanceof ValidationException) {
    return res.status(status).send({
      error: {
        code,
        message
      }
    })
  }

  console.log(err)
  return res.status(status).send({
    message,
    status
  })
}
