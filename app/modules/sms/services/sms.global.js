import globalSMS from '../../../providers/epochta/globalClient'

export default {
  send: async ({phone, message}) => {
    return globalSMS.sendSMS({
      sender: process.env.SMS_COMPANY_NAME,
      text: message,
      phone
    })
  },
}