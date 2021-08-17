import globalSMS from '../../../providers/epochta/globalClient'
import {addUAFormat} from '../../../utils/phone'

export default {
  send: async ({phone, message}) => {
    console.log('GLOBAL', process.env.SMS_COMPANY_NAME, message, addUAFormat(phone))
    return globalSMS.sendSMS({
      sender: process.env.SMS_COMPANY_NAME,
      text: message,
      phone: addUAFormat(phone)
    })
  },
}