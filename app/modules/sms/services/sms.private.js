import ApiException from '../../../exceptions/api'

import {privateSMS} from '../../../providers/smsc'

import {setTime} from '../../../utils/time'
import {decrypt} from '../../../utils/crypto'
import {makeRandom} from '../../../utils/make-random'

import SMSConfigurationModel from '../sms.model'
import CompanyModel from '../../companies/models/company'

import appointmentService from '../../appointments/appointment.service'

import {
  isTimeExpired,
  isAppointmentEdited,
  remindNotifyMessage,
  creationNotifyMessage
} from '../sms.view'

export default {
  sendAfterAppointmentCreate: async ({smsRemindNotify, smsCreationNotify, appointmentId, ...data}) => {
    if (data.isQueue) {
      return
    }

    if (!smsRemindNotify && !smsCreationNotify) {
      return
    }

    const appointment = await appointmentService.find(appointmentId)

    const startDateTime = setTime(appointment.date, appointment.startTime)

    if (isTimeExpired(startDateTime)) {
      return
    }

    const smsConfiguration = await SMSConfigurationModel.findOne({where: {companyId: data.companyId}})

    if(!smsConfiguration) {
      throw new ApiException(404, 'You don\'t have sms configuration!')
    }

    const SMS = privateSMS({
      login: smsConfiguration.login,
      password: decrypt(JSON.parse(smsConfiguration.password))
    })

    if(smsCreationNotify) {
      await SMS.send({
        phones: appointment.phone || appointment.client.phone,
        mes: creationNotifyMessage(appointment)
      })
    }

    if(smsRemindNotify) {
      const sendDateTime = startDateTime.subtract(smsConfiguration.remindBeforeInMinutes, 'm')

      await SMS.send({
        id: appointment.smsIdentifier,
        mes: remindNotifyMessage(appointment),
        time: sendDateTime.format('DD.MM.YY HH:mm'),
        phones: appointment.phone || appointment.client.phone
      })
    }
  },

  sendAfterAppointmentUpdate: async (data, appointmentId) => {
    const appointment = await appointmentService.find(appointmentId)

    if(!appointment) {
      throw new ApiException(404, 'Appointment was not found!')
    }

    let smsIdentifier = appointment.smsIdentifier

    const smsConfiguration = await SMSConfigurationModel.findOne({where: {companyId: data.companyId}})

    if(!smsConfiguration) {
      return smsIdentifier
    }

    const SMS = privateSMS({
      login: smsConfiguration.login,
      password: decrypt(JSON.parse(smsConfiguration.password))
    })

    const phone = appointment.phone || appointment.client.phone

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

    if(data.smsRemindNotify) {
      smsIdentifier = makeRandom(4)

      const sendDateTime = startDateTime.subtract(smsConfiguration.remindBeforeInMinutes, 'm')

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

  addSMSConfiguration: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    return SMSConfigurationModel.create({
      ...data,
      token: '', // TODO: Need remove from model
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
      password: decrypt(JSON.parse(smsConfig.password))
    }

    return privateSMS(creds).send({
      id,
      time,
      phones: phone,
      mes: message
    })
  },

  balance: async ({companyId}) => {
    const smsConfig = await SMSConfigurationModel.findOne({where: {companyId}})

    if(!smsConfig) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const creds = {
      login: smsConfig.login,
      password: decrypt(JSON.parse(smsConfig.password))
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
      password: decrypt(JSON.parse(smsConfig.password))
    }
    
    return privateSMS(creds).getStatus({
      phone,
      all: 1,
      id : smsIdentifier,
      psw: creds.password,
      login: creds.login
    })
  }
}