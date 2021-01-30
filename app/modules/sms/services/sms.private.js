import ApiException from '../../../exceptions/api'
import {privateSMS} from '../../../providers/smsc'
import {setTime} from '../../../utils/time'
import {makeRandom} from '../../../utils/make-random'
import CompanySettingsModel from '../../companies/models/settings'
import appointmentService from '../../appointments/appointment.service'

import {
  isTimeExpired,
  isAppointmentEdited,
  remindNotifyMessage,
  creationNotifyMessage
} from '../sms.view'
import decodeSMSCreds from '../../../utils/decodeSMSCreds'

export default {
  sendAfterAppointmentCreate: async ({hasRemindSMS, hasCreationSMS, appointmentId, ...data}) => {
    if (data.isQueue) {
      return
    }

    if (!hasRemindSMS && !hasCreationSMS) {
      return
    }

    const appointment = await appointmentService.find(appointmentId)

    const startDateTime = setTime(appointment.date, appointment.startTime)

    if (isTimeExpired(startDateTime)) {
      return
    }

    const smsConfiguration = await CompanySettingsModel.findOne({where: {companyId: data.companyId}})

    if(!smsConfiguration || !smsConfiguration.smsToken) {
      throw new ApiException(404, 'You don\'t have sms configuration!')
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)
    const SMS = privateSMS(smsCreds)

    if(hasCreationSMS) {
      await SMS.send({
        phones: appointment.phone || appointment.client.user.phone,
        mes: creationNotifyMessage(appointment)
      })
    }

    if(hasRemindSMS) {
      const sendDateTime = startDateTime.subtract(smsConfiguration.remindSMSMinutes, 'm')

      await SMS.send({
        id: appointment.smsIdentifier,
        mes: remindNotifyMessage(appointment),
        time: sendDateTime.format('DD.MM.YY HH:mm'),
        phones: appointment.phone || appointment.client.user.phone
      })
    }
  },

  sendAfterAppointmentUpdate: async (data, appointmentId) => {
    const appointment = await appointmentService.find(appointmentId)

    if(!appointment) {
      throw new ApiException(404, 'Appointment was not found!')
    }

    let smsIdentifier = appointment.smsIdentifier

    const smsConfiguration = await CompanySettingsModel.findOne({where: {companyId: data.companyId}})

    if(!smsConfiguration || !smsConfiguration.smsToken) {
      return smsIdentifier
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)
    const SMS = privateSMS(smsCreds)

    const phone = appointment.phone || appointment.client.user.phone

    if (data.isQueue) {
      await smsIdentifier && SMS.remove({
        id: smsIdentifier,
        phone
      })

      return null
    }

    if (isAppointmentEdited(appointment, data) === false) {
      return smsIdentifier
    }

    const startDateTime = setTime(data.date, data.startTime)

    if (isTimeExpired(startDateTime)) {
      return smsIdentifier
    }

    if (smsIdentifier) {
      // remove old sms
      await SMS.remove({
        id: smsIdentifier,
        phone
      })

      smsIdentifier = null
    }

    if(data.hasRemindSMS) {
      smsIdentifier = makeRandom(4)

      const sendDateTime = startDateTime.subtract(smsConfiguration.remindSMSMinutes, 'm')

      const message = remindNotifyMessage({
        ...data,
        procedures: appointment.procedures
      })

      await SMS.send({
        id: smsIdentifier,
        mes: message,
        time: sendDateTime.format('DD.MM.YY HH:mm'),
        phones: phone
      })
    }

    return smsIdentifier
  },

  send: async ({phone, message, id, time}, companyId) => {
    const smsConfiguration = await CompanySettingsModel.findOne({where: {companyId}})

    if(!smsConfiguration || smsConfiguration.smsToken) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)

    return privateSMS(smsCreds).send({
      id,
      time,
      phones: phone,
      mes: message
    })
  },

  balance: async ({companyId}) => {
    const smsConfiguration = await CompanySettingsModel.findOne({where: {companyId}})

    if(!smsConfiguration || !smsConfiguration.smsToken) {
      throw new ApiException(404, 'SMS Configuretion was not found')
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)

    return privateSMS(smsCreds).getBalance(smsCreds)
  },

  status: async ({phone, smsIdentifier}, companyId) => {
    const smsConfiguration = await CompanySettingsModel.findOne({where: {companyId}})

    if(!smsConfiguration) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)
    
    return privateSMS(smsCreds).getStatus({
      phone,
      all: 1,
      id : smsIdentifier,
      psw: smsCreds.password,
      login: smsCreds.login
    })
  }
}