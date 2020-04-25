import CompanyModel from './company.model'

export default {
  findAll: async (params) => {
    return CompanyModel.findAll()
  },

  create: async (data) => {
    return CompanyModel.create(data)
  }
}
