import AppointmentModel from './appointment.model'

export default {
  findAll: async () => {
    return AppointmentModel.findAll()
  },

  create: async data => {
    return AppointmentModel.create(data)
  }
}
