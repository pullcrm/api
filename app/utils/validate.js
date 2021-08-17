import ValidationException from "../exceptions/validation"

export default (data, schema) => {
  const validator = schema.validate(data)

  if(validator.error) {
    const code = Number(validator.error.message.split(':')[0])
    const message = validator.error.message.split(':')[1]

    throw new ValidationException(code, message)
  }
}
