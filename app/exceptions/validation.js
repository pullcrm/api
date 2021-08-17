export default class ValidationException extends Error {
  constructor (fieldName, message) {
    super()
    this.message = message
    this.fieldName = fieldName
    this.status = 200
  }
}
  