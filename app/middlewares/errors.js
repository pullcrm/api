import {UNIQUE_CATEGORY_NAME} from '../constants/messages'
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
      message = UNIQUE_CATEGORY_NAME
    }

    if(fieldName === 'specialists_company_id_user_id_role_id') {
      fieldName = 'phone'
      message = 'Сотрудник с таким номером уже есть в компании'
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
