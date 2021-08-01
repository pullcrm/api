import ApiException from '../../../exceptions/api'
import privateSMS from '../../../providers/epochta/privateClient'
import {setTime} from '../../../utils/time'
import SMSSettingsModel from '../../sms/models/settings.model'
import appointmentService from '../../appointments/appointment.service'

import {
  isTimeExpired,
  remindNotifyMessage,
  creationNotifyMessage
} from '../sms.view'
import decodeSMSCreds from '../../../utils/decodeSMSCreds'
import SMSHistoryModel from '../models/history.model'
import {encrypt} from '../../../utils/crypto'
import CompanyModel from '../../companies/models/company'
import exclude from '../../../utils/exclude'
import {addUAFormat} from '../../../utils/phone'

export default {
  createAppointment: async ({hasRemindSMS, hasCreationSMS, appointmentId, ...data}) => {
    const appointment = await appointmentService.find(appointmentId)
    const smsConfiguration = await this.getSmsConfiguration(data.companyId)

    const isExpired = isTimeExpired({
      date: appointment.date,
      startTime: appointment.startTime
    })

    if (!smsConfiguration || isExpired || appointment.isQueue) {
      return
    }

    // Set default value if you don`t pass on to custom
    if (hasRemindSMS === undefined) {
      hasRemindSMS = smsConfiguration.hasRemindSMS
    }

    // Set default value if you don`t pass on to custom
    if (hasCreationSMS === undefined) {
      hasCreationSMS = smsConfiguration.hasCreationSMS
    }

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)
    const SMS = privateSMS(smsCreds)

    const params = {
      smsClient: SMS,
      companyId: data.companyId,
      appointment,
      smsConfiguration,
    }

    if (SMS.isValid !== false) {
      await Promise.all([
        hasRemindSMS && this.sendSmsRemember(params),
        hasCreationSMS && this.sendSmsCreation(params)
      ])
    }
  },

  removeSmsRemember: async (data, appointmentId) => {
    const appointment = await appointmentService.find(appointmentId)

    const {smsIdentifier} = appointment

    const smsConfiguration = this.getSmsConfiguration(data.companyId)

    const smsCreds = decodeSMSCreds(smsConfiguration.smsToken)
    const SMS = privateSMS(smsCreds)

    if(smsConfiguration && smsIdentifier) {
      // There may be an error that smsIdentifier was not found in atomic
      await SMS.cancelCampaign({
        id: smsIdentifier
      })

      // TODO: Change row status or remove row from SMSHistoryModel

      await appointment.update({
        smsIdentifier: null
      })
    }
  },

  // TODO: Maybe it can be removed
  send: async ({phone, message, id, time}, companyId) => {
    const smsConfiguration = this.getSmsConfiguration(companyId)

    if(!smsConfiguration) {
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

  balance: async function ({companyId}) {
    const smsConfiguration = this.getSmsConfiguration(companyId)

    if(!smsConfiguration) {
      throw new ApiException(404, 'SMS Config was not found')
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
    const smsConfiguration = this.getSmsConfiguration(companyId)

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
    } catch {
      throw new ApiException(404, 'SMS account wasn\'t found')
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

  getSmsConfiguration: async companyId => {
    const smsConfiguration = await SMSSettingsModel.scope('withSMSToken').findOne({where: {companyId}})

    if(smsConfiguration && smsConfiguration.smsToken) {
      return smsConfiguration
    }
  },

  sendSmsRemember: async (smsClient, appointment, smsConfiguration, companyId) => {
    const {companyName, creationSMSTemplate} = smsConfiguration

    const smsResponse = await smsClient.sendSMS({
      sender: companyName || process.env.SMS_COMPANY_NAME,
      phone: addUAFormat(appointment.phone || appointment.client.user.phone),
      text: creationNotifyMessage(appointment, creationSMSTemplate)
    })

    SMSHistoryModel.create({
      type: 'CREATE',
      companyId,
      recipient: appointment.phone || appointment.client.user.phone,
      smsIdentifier: smsResponse.id,
      message: creationNotifyMessage(appointment, creationSMSTemplate),
      datetime: new Date()
    })
  },

  sendSmsCreation: async (smsClient, appointment, smsConfiguration, companyId) => {
    const {remindSMSMinutes, companyName, remindSMSTemplate} = smsConfiguration

    const startDateTime = setTime(appointment.date, appointment.startTime)
    const sendDateTime = startDateTime.subtract(remindSMSMinutes, 'm')
      
    const smsResponse = await smsClient.sendSMS({
      sender: companyName || process.env.SMS_COMPANY_NAME,
      text: remindNotifyMessage(appointment, remindSMSTemplate),
      datetime: sendDateTime.format('YYYY-MM-DD HH:mm:ss'),
      phone: addUAFormat(appointment.phone || appointment.client.user.phone)
    })
    
    if(smsResponse.id) {
      await appointment.update({smsIdentifier: smsResponse.id})
    }

    SMSHistoryModel.create({
      type: 'REMIND',
      companyId,
      recipient: appointment.phone || appointment.client.user.phone,
      smsIdentifier: smsResponse.id,
      message: remindNotifyMessage(appointment, remindSMSTemplate),
      datetime: sendDateTime
    })
  }
}