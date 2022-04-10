import * as Sentry from '@sentry/node'
import AppointmentModel from './appointment.model'
import {mysql} from '../../config/connections'
import ProcedureModel from '../procedures/models/procedure'
import UserModel from '../users/user.model'
import ApiException from '../../exceptions/api'
import {Op} from 'sequelize'
import ClientModel from '../clients/client.model'
import SpecialistModel from '../specialists/models/specialist'
import SMSGlobalService from '../sms/services/sms.global'
import {IN_QUEUE} from '../../constants/appointments'

export default {
  findAll: async ({date, companyId, status}) => {
    const baseCondition = {
      companyId,
      date:  {[Op.between]: [date, date]}
    }

    if(status) {
      baseCondition.status = status
    }

    return AppointmentModel.findAll({
      where: baseCondition,
      attributes: {exclude: ['companyId', 'specialistId', 'clientId']},
      include: [
        {model: ProcedureModel, as: 'procedures', through: {attributes: []}, attributes: {exclude: ['companyId']}},
        {model: SpecialistModel,  as: 'specialist', include: {model: UserModel}},
        {model: ClientModel, as: 'client', include: {model: UserModel}}
      ],
    })
  },

  find: async appointmentId => {
    return AppointmentModel.findOne({where: {id: appointmentId}, include: [
      {model: ProcedureModel, as: 'procedures'},
      {model: SpecialistModel, as: 'specialist', include: [{model: UserModel}]},
      {model: ClientModel, as: 'client', include: [{model: UserModel}]}
    ]})
  },

  create: async (data, {companyId}) => {
    const result = await mysql.transaction(async transaction => {
      const appointment = await AppointmentModel.create({...data, companyId}, {transaction})
      await appointment.setProcedures(data.procedures, {transaction})

      return appointment
    })

    return result
  },

  update: async (data, {appointmentId, companyId}) => {
    const appointment = await AppointmentModel.findOne({where: {id: appointmentId}})

    if(!appointment) {
      throw new ApiException(404, 'Appointment wasn\'t found')
    }

    if(appointment.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your appointment')
    }

    const result = await mysql.transaction(async transaction => {
      await appointment.update(data, {transaction})

      if(data.procedures && Array.isArray(data.procedures)) {
        await appointment.setProcedures(data.procedures, {transaction})
      }

      return appointment
    })

    return result
  },

  destroy: async ({appointmentId, companyId}) => {
    const appointment = await AppointmentModel.findOne({where: {id: appointmentId}})
    const smsIdentifier = appointment.smsIdentifier

    if(!appointment) {
      throw new ApiException(404, 'Appointment wasn\'t found')
    }

    if(appointment.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your appointment')
    }

    await SMSGlobalService.destroySMS({smsIdentifier})
    await appointment.destroy({cascade: true})
    return {destroy: 'OK'}
  },

  changeSMSIdentifier: async ({smsIdentifier}, {appointmentId, companyId}) => {
    const appointment = await AppointmentModel.findOne({where: {id: appointmentId}})

    if(!appointment) {
      throw new ApiException(404, 'Appointment wasn\'t found')
    }

    if(appointment.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your appointment')
    }

    await appointment.update({smsIdentifier})
  },

  fetchBySpecialistId: async ({date, companyId, excludeId, specialistId}) => {
    const baseCondition = {
      companyId,
      specialistId,
      date: {[Op.between]: [date, date]},
      status: {[Op.not]: IN_QUEUE}
    }

    if (excludeId) {
      baseCondition.id = {
        [Op.ne]: excludeId
      }
    }

    return AppointmentModel.findAll({
      where: baseCondition,
      attributes: {exclude: ['companyId', 'specialistId', 'clientId']},
      include: [
        {model: ProcedureModel, as: 'procedures', through: {attributes: []}, attributes: {exclude: ['companyId']}}
      ],
    })
  },
}
