import ApiException from "../exceptions/api"

export default (data, schema) => {
  const validator = schema.validate(data)

  if(validator.error) {
    throw new ApiException(400, validator.error.message)
  }
}
