import * as Sentry from '@sentry/node'

import ApiException from '../../../exceptions/api'
import privateSMS from '../../../providers/epochta/privateClient'
import {setTime} from '../../../utils/time'
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
import {addUAFormat} from '../../../utils/phone'
import ValidationException from '../../../exceptions/validation'

export default {
  sendAfterAppointmentCreate: async ({hasRemindSMS, hasCreationSMS, appointmentId, ...data}) => {
    try {
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
  
      if(hasCreationSMS) {
        const SMS = privateSMS(smsCreds)
        const smsResponse = await SMS.sendSMS({
          sender: smsConfiguration.companyName || process.env.SMS_COMPANY_NAME,
          phone: addUAFormat(appointment.phone || appointment.client.user.phone),
          text: creationNotifyMessage(appointment, smsConfiguration.creationSMSTemplate)
        })
  
        SMSHistoryModel.create({
          type: 'CREATE',
          companyId: data.companyId,
          recipient: appointment.phone || appointment.client.user.phone,
          smsIdentifier: smsResponse.id,
          message: creationNotifyMessage(appointment, smsConfiguration.creationSMSTemplate),
          datetime: new Date()
        })
      }
  
      if(hasRemindSMS) {
        const SMS = privateSMS(smsCreds)
        const sendDateTime = startDateTime.subtract(smsConfiguration.remindSMSMinutes, 'm')
  
        const smsResponse = await SMS.sendSMS({
          sender: smsConfiguration.companyName || process.env.SMS_COMPANY_NAME,
          text: remindNotifyMessage(appointment, smsConfiguration.remindSMSTemplate),
          datetime: sendDateTime.format('YYYY-MM-DD HH:mm:ss'),
          phone: addUAFormat(appointment.phone || appointment.client.user.phone)
        })
        
        if(smsResponse.id) {
          await appointment.update({smsIdentifier: smsResponse.id})
        }
  
        SMSHistoryModel.create({
          type: 'REMIND',
          companyId: data.companyId,
          recipient: appointment.phone || appointment.client.user.phone,
          smsIdentifier: smsResponse.id,
          message: remindNotifyMessage(appointment, smsConfiguration.remindSMSTemplate),
          datetime: sendDateTime
        })
      }
    } catch (err) {
      Sentry.captureException(err)
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

    // TODO: Refactor to https://github.com/uramen/pullcrm/pull/75
    const phone = appointment.phone
    // const phone = appointment.phone || appointment.client.user.phone

    if (!phone || phone.length < 10) {
      return null
    }

    if (data.isQueue) {
      await smsIdentifier && SMS.cancelCampaign({
        id: smsIdentifier
      })

      return null
    }

    if (!data.startTime || !isAppointmentEdited(appointment, data)) {
      return smsIdentifier
    }

    const startDateTime = setTime(data.date, data.startTime)

    if (isTimeExpired(startDateTime)) {
      return smsIdentifier
    }

    if (smsIdentifier) {
      await SMS.cancelCampaign({
        id: smsIdentifier
      })

      smsIdentifier = null
    }

    if(data.hasRemindSMS) {
      const sendDateTime = startDateTime.subtract(smsConfiguration.remindSMSMinutes, 'm')

      const message = remindNotifyMessage({
        ...data,
        procedures: appointment.procedures,
        specialist: appointment.specialist,
      }, smsConfiguration.remindSMSTemplate)

      const smsResponse = await SMS.sendSMS({
        sender: smsConfiguration.companyName || process.env.SMS_COMPANY_NAME,
        text: message,
        datetime: sendDateTime.format('YYYY-MM-DD HH:mm:ss'),
        phone: addUAFormat(phone)
      })

      if(smsResponse.id) {
        smsIdentifier = smsResponse.id
      }

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

    return privateSMS(smsCreds).sendSMS({
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
    const currency = 'UAH'
    const response = await privateSMS(smsCreds).getUserBalance({currency})

    return {
      balance: response.balance_currency,
      currency
    }
  },

  status: async ({smsIdentifier}, companyId) => {
    const smsConfiguration = await SMSSettingsModel.scope('withSMSToken').findOne({where: {companyId}})

    if(!smsConfiguration) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)
    
    const response = await privateSMS(smsCreds).getCampaignDeliveryStats({
      id : smsIdentifier,
    })

    return {
      status: response.status[0],
      phone: response.phone[0]
    }
  },

  addSettings: async (data, {companyId, userId}) => {
    const SMS = privateSMS({
      publicKey: data.publicKey,
      privateKey: data.privateKey,
    })

    try {
      await SMS.getUserBalance({currency: 'UAH'})
    } catch(error) {
      throw new ValidationException('*', 'СМС акаунт небыл найден')
    }

    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const smsToken = Buffer.from(JSON.stringify({
      publicKey: data.publicKey,
      privateKey: encrypt(data.privateKey)
    })).toString('hex')

    const settings = await SMSSettingsModel.create({
      hasRemindSMS: data.hasRemindSMS,
      remindSMSMinutes: data.remindSMSMinutes,
      hasCreationSMS: data.hasCreationSMS,
      creationSMSTemplate: data.creationSMSTemplate,
      remindSMSTemplate: data.remindSMSTemplate,
      companyName: data.companyName,
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