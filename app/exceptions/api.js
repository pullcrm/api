export default class ApiException extends Error {
  constructor (status, message) {
    super()
    this.message = message
    this.status = status
  }
}
