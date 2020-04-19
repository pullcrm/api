import UserModel from './user.model'

export default {
  findAll: async (params) => {
    return UserModel.findAll()
  },

  create: async (data) => {
    return UserModel.create(data)
  }
}
