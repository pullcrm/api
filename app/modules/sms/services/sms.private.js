import ApiException from '../../../exceptions/api'
import {privateSMS} from '../../../providers/smsc'
import {setTime} from '../../../utils/time'
import {makeRandom} from '../../../utils/make-random'
import SMSSettingsModel from '../../sms/models/settings.model'
import appointmentService from '../../appointments/appointment.service'

import {
  isTimeExpired,
  isAppointmentEdited,
  remindNotifyMessage,
  creationNotifyMessage
} from '../sms.view'
import decodeSMSCreds from '../../../utils/decodeSMSCreds'
import SMSHistoryModel from '../models/history.model'
import {encrypt} from '../../../utils/crypto'
import CompanyModel from '../../companies/models/company'
import exclude from '../../../utils/exclude'

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

    const smsConfiguration = await SMSSettingsModel.scope('withSMSToken').findOne({where: {companyId: data.companyId}})

    if(!smsConfiguration || !smsConfiguration.smsToken) {
      throw new ApiException(404, 'You don\'t have sms configuration!')
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)
    const SMS = privateSMS(smsCreds)

    if(hasCreationSMS) {
      await SMS.send({
        phones: appointment.phone || appointment.client.user.phone,
        mes: creationNotifyMessage(appointment, smsConfiguration.creationSMSTemplate)
      })

      SMSHistoryModel.create({
        type: 'CREATE',
        companyId: data.companyId,
        recipient: appointment.phone || appointment.client.user.phone,
        smsIdentifier: null,
        message: creationNotifyMessage(appointment),
        datetime: new Date()
      })
    }

    if(hasRemindSMS) {
      const sendDateTime = startDateTime.subtract(smsConfiguration.remindSMSMinutes, 'm')

      await SMS.send({
        id: appointment.smsIdentifier,
        mes: remindNotifyMessage(appointment, smsConfiguration.remindSMSTemplate),
        time: sendDateTime.format('DD.MM.YY HH:mm'),
        phones: appointment.phone || appointment.client.user.phone
      })

      SMSHistoryModel.create({
        type: 'REMIND',
        companyId: data.companyId,
        recipient: appointment.phone || appointment.client.user.phone,
        smsIdentifier: appointment.smsIdentifier,
        message: remindNotifyMessage(appointment),
        datetime: sendDateTime
      })
    }
  },

  sendAfterAppointmentUpdate: async (data, appointmentId) => {
    const appointment = await appointmentService.find(appointmentId)

    if(!appointment) {
      throw new ApiException(404, 'Appointment was not found!')
    }

    let smsIdentifier = appointment.smsIdentifier

    const smsConfiguration = await SMSSettingsModel.scope('withSMSToken').findOne({where: {companyId: data.companyId}})

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

    if (!data.startTime || isAppointmentEdited(appointment, data) === false) {
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
        procedures: appointment.procedures,
        specialist: appointment.specialist,
      }, smsConfiguration.remindSMSTemplate)

      await SMS.send({
        id: smsIdentifier,
        mes: message,
        time: sendDateTime.format('DD.MM.YY HH:mm'),
        phones: phone
      })

      SMSHistoryModel.create({
        type: 'REMIND',
        companyId: data.companyId,
        recipient: phone,
        smsIdentifier: smsIdentifier,
        message: message,
        datetime: sendDateTime
      })
    }

    return smsIdentifier
  },

  send: async ({phone, message, id, time}, companyId) => {
    const smsConfiguration = await SMSSettingsModel.scope('withSMSToken').findOne({where: {companyId}})

    if(!smsConfiguration || !smsConfiguration.smsToken) {
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
    const smsConfiguration = await SMSSettingsModel.scope('withSMSToken').findOne({where: {companyId}})

    if(!smsConfiguration || !smsConfiguration.smsToken) {
      throw new ApiException(404, 'SMS Configuretion was not found')
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)

    return privateSMS(smsCreds).getBalance(smsCreds)
  },

  status: async ({phone, smsIdentifier}, companyId) => {
    const smsConfiguration = await SMSSettingsModel.scope('withSMSToken').findOne({where: {companyId}})

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
  },

  addSettings: async (data, {companyId, userId}) => {
    const SMS = privateSMS({
      login: data.login,
      password: data.password
    })

    const result = await SMS.getBalance()

    if (JSON.parse(result).error) {
      throw new ApiException(404, 'SMS account wasn\'t found')
    }

    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const smsToken = Buffer.from(JSON.stringify({
      login: data.login,
      password: encrypt(data.password)
    })).toString('hex')

    const settings = await SMSSettingsModel.create({
      hasRemindSMS: data.hasRemindSMS,
      remindSMSMinutes: data.remindSMSMinutes,
      hasCreationSMS: data.hasCreationSMS,
      creationSMSTemplate: data.creationSMSTemplate,
      remindSMSTemplate: data.remindSMSTemplate,
      smsToken: smsToken,
      companyId
    })

    return exclude(settings, ['smsToken'])
  },

  updateSettings: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})
    
    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const settings = await SMSSettingsModel.findOne({where: {companyId: company.id}})

    if(!settings) {
      throw new ApiException(404, 'You don\'t have SMS settings!')
    }

    return settings.update(data)
  },

  deleteSettings: async ({companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const settings = await SMSSettingsModel.findOne({where: {companyId: company.id}})

    if(!settings) {
      throw new ApiException(404, 'You don\'t have SMS settings!')
    }

    return settings.destroy({companyId})
  },
}