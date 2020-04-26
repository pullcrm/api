import Company from './models/company'

export default {
  findAll: async (params) => {
    return Company.findAll()
  },

  create: async (data) => {
    return Company.create(data)
  }
}
