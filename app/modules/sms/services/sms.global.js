import {globalSMS} from '../../../providers/smsc'

export default {
  send: async (phone, message) => {
    return globalSMS.send({
      phones: phone,
      mes: message
    })
  },
}