import AppointmentModel from './appointment.model'
import {mysql} from '../../config/connections'

export default {
  findAll: async () => {
    return AppointmentModel.findAll()
  },

  create: async data => {
    const result = await mysql.transaction(async transaction => {
      const appointment = await AppointmentModel.create(data, {transaction})
      await appointment.setProcedures(data.procedures, {transaction})

      return appointment
    })

    return result
  }
}
