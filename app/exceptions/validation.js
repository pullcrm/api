export default class ValidationException extends Error {
  constructor (code, message) {
    super()
    this.message = message
    this.code = code
    this.status = 200
  }
}
  