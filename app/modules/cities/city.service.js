import CityModel from './city.model'

export default {
  findAll: async () => {
    return CityModel.findAll()
  },

  create: async data => {
    return CityModel.create(data)
  }
}
