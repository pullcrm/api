import UserModel from './user.model'
import ApiException from "../../exceptions/api";

export default {
  findAll: async (params) => {
    return UserModel.findAll()
  },

  findOne: async (where) => {
    const user = UserModel.findOne({where})

    if(!user) {
      throw new ApiException(404, 'User wasn\'t found')
    }

    return user
  },

  create: async (data) => {
    return UserModel.create(data)
  }
}
