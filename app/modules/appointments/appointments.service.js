import AppointmentModel from './appointments.model'

export default {
  findAll: async (params) => {
    return AppointmentModel.findAll()
  },

  create: async (data) => {
    return AppointmentModel.create(data)
  }
}
