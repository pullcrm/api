// import SMSClient from '../../../providers/smsc/client'

// const SMS_CLIENT_LOGIN = process.env.SMS_CLIENT_LOGIN
// const SMS_CLIENT_PASSWORD = process.env.SMS_CLIENT_PASSWORD

// const globalSMS = new SMSClient({
//   login: SMS_CLIENT_LOGIN,
//   password: SMS_CLIENT_PASSWORD
// })

import globalSMS from '../../../providers/epochta/globalClient'

export default {
  send: async ({phone, message}) => {
    return globalSMS.sendSMS({
      sender: 'Pullcrm',
      text: message,
      phone
    })
  },
}