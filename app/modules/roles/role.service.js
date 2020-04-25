import RoleModel from './role.model'

export default {
  findAll: async (params) => {
    return RoleModel.findAll()
  },

  create: async (data) => {
    return RoleModel.create(data)
  }
}
