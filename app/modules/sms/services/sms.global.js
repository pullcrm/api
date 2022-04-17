import turboSMS from '../../../providers/turbosms'
import BalanceModel from "../../balance/models/balance"
import SMSGlobalService from './sms.global'
import SMSHistoryModel from '../models/history.model'
import appointmentService from '../../appointments/appointment.service'
import SMSSettingsModel from '../models/settings.model'
import {creationNotifyMessage, isTimeExpired, remindNotifyMessage} from '../sms.view'
import {setTime} from '../../../utils/time'
import ApiException from '../../../exceptions/api'
import * as Sentry from '@sentry/node'
import CompanyModel from '../../companies/models/company'
import SMSScheduler from '../../../jobs/sms.scheduler'
import lifecell from '../../../providers/lifecell'
import BalanceService from '../../balance/balance.service'
import {IN_QUEUE} from '../../../constants/appointments'
import {SEND_SMS} from '../../../constants/balance'
import {ACCEPTED, DELIVERED, HANDLED, PLANNED, SKIPED} from '../../../constants/sms'

export default {
  findAll: async ({companyId, limit, offest}) => {
    return SMSHistoryModel.findAll({
      where: {companyId},
      limit,
      offest,
      attributes: {exclude: ['companyId', 'jobId', 'lifecellId']},
    })
  },

  handleStatus: async ({id, status, date}) => {
    const messageHistory = await SMSHistoryModel.findOne({where: {lifecellId: id}})

    if(!messageHistory) {
      return {status: SKIPED}
    }

    const campany = await CompanyModel.findOne({where: {id: messageHistory.companyId}})

    if(status === DELIVERED) {
      await messageHistory.update({status: status.toUpperCase(), sendDate: date})
      await BalanceModel.create({userId: campany.userId, amount: -messageHistory.price, description: SEND_SMS})
    }

    await messageHistory.update({status: status.toUpperCase()})
    return {status: HANDLED}
  },

  sendImmediateGlobal: async ({message, phone}) => {
    const response = await lifecell.sendOneSMS({message, phone})
    return response
  },

  sendImmediate: async ({message, phone, alphaName}, companyId) => {
    const response = await lifecell.sendOneSMS({message, phone, alphaName})
    const isAccepted = response.state.value === ACCEPTED
   
    await SMSHistoryModel.create({
      lifecellId: response.id,
      recipient: phone,
      status: response.state.value.toUpperCase(),
      message,
      price: isAccepted ? process.env.SMS_PRICE : 0.00,
      companyId
    })

    return response
  },

  sendDelayed:  async ({sendDate, message, phone, alphaName}, companyId) => {
    const delay = new Date(sendDate) -  new Date()
    const jobId = +new Date()

    const job = await SMSScheduler.smsQueue.add({message, phone, alphaName}, {jobId, delay})
    
    await SMSHistoryModel.create({
      jobId: job.id,
      recipient: phone,
      status: PLANNED,
      message: message,
      sendDate,
      price: process.env.SMS_PRICE,
      companyId
    })

    return job
  },

  createAppointment: async ({hasRemindSMS, hasCreationSMS = false}, params) => {
    try {
      const appointment = await appointmentService.find(params.appointmentId)
      const startDateTime = setTime(appointment.date, appointment.startTime)
      const company = await CompanyModel.findOne({where: {id: params.companyId}})
      const {balance} = await BalanceService.getBalance({userId: company.userId})
      const isInQueue = appointment.status === IN_QUEUE
      const phone = appointment.phone
      const isExpired = isTimeExpired(startDateTime)

      if(isInQueue || (!hasRemindSMS && !hasCreationSMS) || !phone || isExpired || balance <= 0) {
        return
      }

      const smsSettings = await SMSSettingsModel.findOne({where: {companyId: params.companyId}})
  
      if(!smsSettings) {
        throw new ApiException(404, 'You don\'t have sms setting!')
      }

      if(hasCreationSMS) {
        await SMSGlobalService.sendImmediate({
          alphaName: smsSettings.companyName || process.env.SMS_COMPANY_NAME,
          phone,
          message: creationNotifyMessage(appointment, smsSettings.creationSMSTemplate)
        }, company.id)
      }

      if(hasRemindSMS) {
        const sendDateTime = startDateTime.subtract(smsSettings.remindSMSMinutes, 'm')
  
        const smsResponse = await SMSGlobalService.sendDelayed({
          alphaName: smsSettings.companyName || process.env.SMS_COMPANY_NAME,
          message: remindNotifyMessage(appointment, smsSettings.remindSMSTemplate),
          sendDate: sendDateTime,
          phone
        }, company.id)
        
        if(smsResponse.id) {
          await appointment.update({smsIdentifier: smsResponse.id})
        }
      }

    } catch(err) {
      console.log(err)
      Sentry.captureException(err)
    }
  },

  destroySMS: async ({smsIdentifier}) => {
    try {
      if(smsIdentifier) {
        const job = await SMSScheduler.smsQueue.getJob(smsIdentifier)
        return job.remove()
      }
    } catch(err) {
      console.log(err)
      Sentry.captureException(err)
    }
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