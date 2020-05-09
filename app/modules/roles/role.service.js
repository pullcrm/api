import RoleModel from './role.model'

export default {
  findAll: async () => {
    return RoleModel.findAll()
  },

  create: async data => {
    return RoleModel.create(data)
  }
}
