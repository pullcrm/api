import UserModel from './user.model'
import ApiException from "../../exceptions/api";
import {mysql} from "../../config/connections";
import CompanyModel from "../companies/models/company";

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
  },

  createByEmail: async (employers, companyId) => {
    const result = await mysql.transaction(async transaction => {
      const userInstance = await CompanyModel.bulkCreate(employers.map(E => ({...E, companyId})), {returning: true, transaction})
      return userInstance
    })

    return result
  }
}
