import UserModel from './user.model'

export default {
  findAll: async (params) => {
    return await UserModel.findAll()
  }
}
