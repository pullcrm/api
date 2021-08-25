// import ApiException from '../exceptions/api'
// import {INTERNAL_SERVER_ERROR} from 'http-status'
// import {ERROR_HAPPEN} from '../constants/messages'

import ValidationException from "../exceptions/validation"

export const errorsHandler = (err, res) => {
  let message = err.message
  let status = err.status || 500

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
    let fieldName = err.errors[0].path
    message = err.errors[0].message
    status = 200

    if(fieldName === 'categories_name_company_id') {
      fieldName = 'name'
      message = 'Имя категории должно быть уникальным'
    }

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
