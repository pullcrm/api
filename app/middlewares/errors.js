// import ApiException from '../exceptions/api'
// import {INTERNAL_SERVER_ERROR} from 'http-status'
// import {ERROR_HAPPEN} from '../constants/messages'

import {ValidationErrorItem} from "sequelize"
import ValidationException from "../exceptions/validation"

export const errorsHandler = (err, res) => {
  let message = err.message
  let status = err.status || 500

  if(err.name === 'SequelizeUniqueConstraintError') {
    message = Array.isArray(err.errors) && err.errors.map(E => E.message).join(';\n')
    status = 400
  }

  if (err instanceof ValidationException) {
    const fieldName = err.fieldName

    return res.status(status).send({
      error: {
        fieldName,
        message
      }
    })
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    console.log(err.errors[0])
    const fieldName = err.errors[0].path

    return res.status(status).send({
      error: {
        fieldName,
        message
      }
    })
  }

  return res.status(status).send({
    message,
    status
  })
}
