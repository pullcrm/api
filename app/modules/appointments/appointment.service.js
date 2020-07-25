import AppointmentModel from './appointment.model'
import {mysql} from '../../config/connections'
import ProcedureModel from '../procedures/procedure.model'
import UserModel from '../users/user.model'
import ApiException from '../../exceptions/api'

export default {
  findAll: async data => {
    return AppointmentModel.findAll({
      where: {companyId: data.companyId},
      attributes: {exclude: ['companyId', 'employeeId', 'clientId']},
      include: [
        {model: ProcedureModel, as: 'procedures', through: {attributes: []}, attributes: {exclude: ['companyId']}},
        {model: UserModel, as: 'employee'},
        {model: UserModel, as: 'client'}
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
}
