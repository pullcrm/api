import joi from "joi"
import ApiException from "../exceptions/api"

export default (data, schema) => {
  const validator = joi.validate(data, schema)

  if(validator.error) {
    throw new ApiException(400, validator.error.message)
  }
}
