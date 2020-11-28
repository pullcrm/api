import SMSClient from './client.js'

export const globalSMS = new SMSClient({
  login: 'tsarr',
  password: 'Xo4Ar2g8'
})

export const privateSMS = (login, password) => new SMSClient(login, password)
