import SMSClient from './client.js'

const SMS_CLIENT_LOGIN = process.env.SMS_CLIENT_LOGIN
const SMS_CLIENT_PASSWORD = process.env.SMS_CLIENT_PASSWORD

export const globalSMS = new SMSClient({
  login: SMS_CLIENT_LOGIN,
  password: SMS_CLIENT_PASSWORD
})

export const privateSMS = (login, password) => new SMSClient(login, password)
