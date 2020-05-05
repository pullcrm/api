import CityModel from './city.model'

export default {
  findAll: async (params) => {
    return CityModel.findAll()
  },

  create: async (data) => {
    return CityModel.create(data)
  }
}
