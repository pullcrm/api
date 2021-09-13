import ValidationException from "../exceptions/validation"

export default (data, schema) => {
  const validator = schema.validate(data)

  if(validator.error) {
    const message = validator.error.message
    const fieldName = validator.error.details[0].context.key
    throw new ValidationException(fieldName, message)
  }
}
