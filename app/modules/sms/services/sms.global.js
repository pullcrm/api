import turboSMS from '../../../providers/turbosms'
import {addUAFormat} from '../../../utils/phone'
import BalanceModel from "../../balance/models/balance"
import SMSGlobalService from './sms.global'
import SMSHistoryModel from '../models/history.model'
import appointmentService from '../../appointments/appointment.service'
import SMSSettingsModel from '../models/settings.model'
import {creationNotifyMessage, isAppointmentEdited, isTimeExpired, remindNotifyMessage} from '../sms.view'
import {setTime} from '../../../utils/time'
import ApiException from '../../../exceptions/api'
import * as Sentry from '@sentry/node'
import CompanyModel from '../../companies/models/company'
import SMSScheduler from '../../../jobs/sms.scheduler'
import lifecell from '../../../providers/lifecell'

export default {
  sendTurboSMS: async ({phone, message}) => {
    const messageOptions = {
      sender: process.env.SMS_COMPANY_NAME,
      sms: {
        text: message,
      },
      recipients: [addUAFormat(phone)]
    }

    const SMSResponse = await turboSMS.message.send(messageOptions)
    return {
      id: SMSResponse.response_result[0].message_id
    }
  },

  handleStatus: async ({id, status}) => {
    const messageHistory = await SMSHistoryModel.findOne({where: {lifecellId: id}})

    if(!messageHistory) {
      throw new ApiException(404, 'There is no such sms in the queue')
    }

    if(status === 'Delivered') {
      await BalanceModel.create({userId: messageHistory.userId, amount: -messageHistory.price, description: 'SEND_SMS'})
    }

    await messageHistory.update({status: status.toUpperCase()})
    return {status: 'Handled'}
  },

  sendImmediate: async ({message, phone, alphaName}, {userId, companyId}) => {
    const response = await lifecell.sendOneSMS({message, phone, alphaName})
    const isAccepted = response.state.value === 'Accepted'
   
    await SMSHistoryModel.create({
      lifecellId: response.id,
      recipient: phone,
      status: response.state.value.toUpperCase(),
      message,
      price: isAccepted ? process.env.SMS_PRICE : 0.00,
      userId,
      companyId
    })

    return response
  },

  sendDelayed:  async ({sendDate, message, phone, alphaName}, {userId, companyId}) => {
    const delay = new Date(sendDate) -  new Date()
    const jobId = +new Date()

    const job = await SMSScheduler.smsQueue.add({message, phone, alphaName}, {jobId, delay})
    
    await SMSHistoryModel.create({
      jobId: job.id,
      recipient: phone,
      status: 'PLANNED',
      message: message,
      sendDate,
      price: process.env.SMS_PRICE,
      userId,
      companyId
    })

    return job
  },

  // sendPrivate: async ({phone, message, startDate = null, sender = 'TAXI'}, {userId, companyId}) => {
  //   const messageOptions = {
  //     sender,
  //     sms: {
  //       text: message,
  //     },
  //     recipients: [addUAFormat(phone)]
  //   }

  //   if(startDate) {
  //     messageOptions.sms.start_time = startDate
  //   }

  //   const SMSResponse = await turboSMS.message.send(messageOptions)
  //   console.log('SERVICE:', SMSResponse, messageOptions)
  //   if(SMSResponse && SMSResponse.response_code === 800) {
  //     const smsIdentifier = SMSResponse.response_result[0].message_id
  
  //     await SMSHistoryModel.create({
  //       smsIdentifier,
  //       recipient: phone,
  //       status: 'PLANNED',
  //       startDate,
  //       message,
  //       price: process.env.TURBO_SMS_PRICE,
  //       userId,
  //       companyId
  //     })

  //     return {
  //       id: SMSResponse.response_result[0].message_id,
  //       status: 'PLANNED'
  //     }
  //   }

  //   await SMSHistoryModel.create({
  //     smsIdentifier: null,
  //     recipient: phone,
  //     status: 'PLANNED',
  //     message,
  //     price: process.env.TURBO_SMS_PRICE,
  //     userId,
  //     companyId
  //   })

  //   return {
  //     id: null,
  //     status: 'FAILED'
  //   }
  // },

  status: async smsIdentifier => {
    const SMSStatus = await turboSMS.message.status(smsIdentifier)

    return SMSStatus
  },

  sendAfterAppointmentCreate: async ({hasRemindSMS, hasCreationSMS, appointmentId, ...data}) => {
    try {
      if (data.isQueue) {
        return
      }
  
      if (!hasRemindSMS && !hasCreationSMS) {
        return
      }
  
      const appointment = await appointmentService.find(appointmentId)

      if(!(appointment.phone || appointment.client)) {
        return
      }
  
      const startDateTime = setTime(appointment.date, appointment.startTime)
  
      if (isTimeExpired(startDateTime)) {
        return
      }
  
      const smsConfiguration = await SMSSettingsModel.findOne({where: {companyId: data.companyId}})
  
      if(!smsConfiguration) {
        throw new ApiException(404, 'You don\'t have sms configuration!')
      }

      const company = await CompanyModel.findOne({where: {id: data.companyId}})
  
      if(hasCreationSMS) {
        await SMSGlobalService.sendImmediate({
          alphaName: smsConfiguration.companyName || process.env.SMS_COMPANY_NAME,
          phone: appointment.phone || appointment.client.user.phone,
          message: creationNotifyMessage(appointment, smsConfiguration.creationSMSTemplate)
        }, {userId: company.userId, companyId: company.id})
      }
  
      if(hasRemindSMS) {
        const sendDateTime = startDateTime.subtract(smsConfiguration.remindSMSMinutes, 'm')
  
        const smsResponse = await SMSGlobalService.sendDelayed({
          alphaName: smsConfiguration.companyName || process.env.SMS_COMPANY_NAME,
          message: remindNotifyMessage(appointment, smsConfiguration.remindSMSTemplate),
          sendDate: sendDateTime,
          phone: addUAFormat(appointment.phone || appointment.client.user.phone)
        }, {userId: company.userId, companyId: company.id})
        
        if(smsResponse.id) {
          await appointment.update({smsIdentifier: smsResponse.id})
        }
      }
    } catch (err) {
      console.log(err)
      Sentry.captureException(err)
    }
  },

  sendAfterAppointmentUpdate: async (data, appointmentId) => {
    const appointment = await appointmentService.find(appointmentId)

    if(!appointment) {
      throw new ApiException(404, 'Appointment was not found!')
    }

    let smsIdentifier = appointment.smsIdentifier

    const smsConfiguration = await SMSSettingsModel.findOne({where: {companyId: data.companyId}})

    if(!smsConfiguration) {
      return smsIdentifier
    }

    // TODO: Refactor to https://github.com/uramen/pullcrm/pull/75
    const phone = appointment.phone
    // const phone = appointment.phone || appointment.client.user.phone

    if (!phone || phone.length < 10) {
      return null
    }

    if (data.isQueue) {
      smsIdentifier && await SMSGlobalService.destroySMS({smsIdentifier})
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
      await SMSGlobalService.destroySMS({
        smsIdentifier,
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

      const company = await CompanyModel.findOne({where: {id: data.companyId}})

      const smsResponse = await SMSGlobalService.sendDelayed({
        alphaName: smsConfiguration.companyName || process.env.SMS_COMPANY_NAME,
        message,
        sendDate: sendDateTime,
        phone
      }, {userId: company.userId, companyId: company.id})

      if(smsResponse.id) {
        smsIdentifier = smsResponse.id
      }
    }

    return smsIdentifier
  },

  destroySMS: async ({smsIdentifier}) => {
    const job = await SMSScheduler.smsQueue.getJob(smsIdentifier)
    return job.remove()
  },

  addSettings: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    const settings = await SMSSettingsModel.create({
      hasRemindSMS: data.hasRemindSMS,
      remindSMSMinutes: data.remindSMSMinutes,
      hasCreationSMS: data.hasCreationSMS,
      creationSMSTemplate: data.creationSMSTemplate,
      remindSMSTemplate: data.remindSMSTemplate,
      companyName: data.companyName,
      companyId
    })

    return settings
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