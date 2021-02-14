import AppointmentModel from './appointment.model'
import {mysql} from '../../config/connections'
import ProcedureModel from '../procedures/models/procedure'
import UserModel from '../users/user.model'
import ApiException from '../../exceptions/api'
import {addDayToDate} from '../../utils/time'
import {Op} from 'sequelize'
import ClientModel from '../clients/client.model'
import SpecialistModel from '../specialists/specialist.model'

export default {
  findAll: async ({date, companyId}) => {
    const baseCondition = {
      isQueue: false,
      companyId
    }

    baseCondition.date = {
      [Op.gt]: date,
      [Op.lt]: addDayToDate(date)
    }

    return AppointmentModel.findAll({
      where: baseCondition,
      attributes: {exclude: ['companyId', 'specialistId', 'clientId']},
      include: [
        {model: ProcedureModel, as: 'procedures', through: {attributes: []}, attributes: {exclude: ['companyId']}},
        {model: SpecialistModel,  as: 'specialist', include: {model: UserModel, raw: true}},
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

  queue: async ({companyId}) => {
    const baseCondition = {
      isQueue: true,
      companyId
    }

    return AppointmentModel.findAll({
      where: baseCondition,
      attributes: {exclude: ['companyId', 'specialistId', 'clientId']},
      include: [
        {model: ProcedureModel, as: 'procedures', through: {attributes: []}, attributes: {exclude: ['companyId']}},
        {model: SpecialistModel, as: 'specialist', include: [{model: UserModel}]},
        {model: ClientModel, as: 'client', include: [{model: UserModel}]}
      ],
    })
  },

  create: async data => {
    const result = await mysql.transaction(async transaction => {
      const appointment = await AppointmentModel.create(data, {transaction})
      await appointment.setProcedures(data.procedures, {transaction})

      return appointment
    })

    return result
  },

  update: async (data, appointmentId) => {
    const appointment = await AppointmentModel.findOne({where: {id: appointmentId}})

    if(!appointment) {
      throw new ApiException(404, 'Appointment wasn\'t found')
    }

    if(appointment.get('companyId') !== data.companyId) {
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

    if(!appointment) {
      throw new ApiException(404, 'Appointment wasn\'t found')
    }

    if(appointment.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your appointment')
    }

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
      isQueue: false,
      companyId,
      specialistId
    }

    if (excludeId) {
      baseCondition.id = {
        [Op.ne]: excludeId
      }
    }

    baseCondition.date = {
      [Op.gt]: date,
      [Op.lt]: addDayToDate(date)
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
