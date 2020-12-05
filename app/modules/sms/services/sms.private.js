import ApiException from '../../../exceptions/api'
import {v4 as uuid} from 'uuid'
import dayjs from 'dayjs'
import {privateSMS} from '../../../providers/smsc'
import SMSConfigurationModel from '../sms.model'
import CompanyModel from '../../companies/models/company'
import {decrypt} from '../../../utils/crypto'
import appointmentService from '../../appointments/appointment.service'
import {creationNotifyMessage, remindNotifyMessage} from '../sms.view'
import {subtractTime} from '../../../utils/time'

export default {
  sendAfterAppointmentCreate: async data => {
    const smsConfiguration = await SMSConfigurationModel.findOne({where: {companyId: data.companyId}})

    if(!smsConfiguration) {
      throw new ApiException(404, 'You don\'t have sms configuration!')
    }

    const appointment = await appointmentService.find(data.appointmentId)

    if(!appointment) {
      throw new ApiException(404, 'Something wrong with the appointment!')
    }

    const creds = {
      login: smsConfiguration.login,
      psw: decrypt(JSON.parse(smsConfiguration.password))
    }

    if(data.smsCreationNotify) {
      await privateSMS(creds).send({
        id: uuid(),
        time: '0',
        phones: appointment.phone || appointment.client.phone,
        mes: creationNotifyMessage(appointment),
        psw: creds.psw
      })
    }

    if(data.smsRemindNotify) {
      const time = `${dayjs(data.date).format('DD.MM.YY')} ${subtractTime(data.startTime, smsConfiguration.remindBeforeInMinutes)}`
      
      await privateSMS(creds).send({
        id: data.smsIdentifier,
        time,
        phones: appointment.phone || appointment.client.phone,
        mes: remindNotifyMessage(appointment, smsConfiguration.remindBeforeInMinutes),
        psw: creds.psw
      })
    }
  },

  sendAfterAppointmentUpdate: async (data, appointment) => {
    const phone = data.phone || appointment.phone || appointment.client.phone

    if(!appointment) {
      throw new ApiException(404, 'Appointment was not found!')
    }

    if(data.startTime !== appointment.get('startTime') && appointment.smsIdentifier) {
      const smsConfiguration = await SMSConfigurationModel.findOne({where: {companyId: data.companyId}})

      if(!smsConfiguration) {
        throw new ApiException(404, 'You don\'t have sms configuration!')
      }

      const creds = {
        login: smsConfiguration.login,
        psw: decrypt(JSON.parse(smsConfiguration.password))
      }

      const sentSMS = await privateSMS(creds).getStatus({
        id: appointment.smsIdentifier,
        phone,
        psw: creds.psw
      })

      if(JSON.parse(sentSMS).status <= 0) {
        await privateSMS(creds).remove({
          id: appointment.smsIdentifier,
          phone,
          psw: creds.psw
        })

        const time = `${dayjs(data.date).format('DD.MM.YY')} ${subtractTime(data.startTime, smsConfiguration.remindBeforeInMinutes)}`
        const smsIdentifier = uuid()

        await privateSMS(creds).send({
          id: smsIdentifier,
          time,
          phones: phone,
          mes: remindNotifyMessage(appointment, smsConfiguration.remindBeforeInMinutes),
          psw: creds.psw
        })
        
        return smsIdentifier
      }
    }
  },

  addSMSConfiguration: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    return SMSConfigurationModel.create({
      ...data,
      companyId
    })
  },

  updateSMSConfiguration: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})
    const smsConfiguration = await SMSConfigurationModel.findOne({where: {companyId: company.id}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    return smsConfiguration.update(data)
  },

  send: async ({phone, message, id, time}, companyId) => {
    const smsConfig = await SMSConfigurationModel.findOne({where: {companyId}})

    if(!smsConfig) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const creds = {
      login: smsConfig.login,
      psw: decrypt(JSON.parse(smsConfig.password))
    }

    return privateSMS(creds).send({
      id,
      time,
      phones: phone,
      mes: message,
      psw: creds.psw
    })
  },

  balance: async ({companyId}) => {
    const smsConfig = await SMSConfigurationModel.findOne({where: {companyId}})

    if(!smsConfig) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const creds = {
      login: smsConfig.login,
      psw: decrypt(JSON.parse(smsConfig.password))
    }

    return privateSMS(creds).getBalance(creds)
  },

  status: async ({phone, smsIdentifier}, companyId) => {
    const smsConfig = await SMSConfigurationModel.findOne({where: {companyId}})

    if(!smsConfig) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const creds = {
      login: smsConfig.login,
      psw: decrypt(JSON.parse(smsConfig.password))
    }
    
    return privateSMS(creds).getStatus({
      phone,
      all: 1,
      id : smsIdentifier,
      psw: creds.psw,
      login: creds.login
    })
  }
}