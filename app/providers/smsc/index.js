import SMSClient from './client.js'

export const privateSMS = (login, password) => new SMSClient(login, password)
