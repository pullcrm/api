import UserModel from './user.model'
import ApiException from "../../exceptions/api"
import {mysql} from "../../config/connections"
import CompanyModel from "../companies/models/company"
import CompleteRegistrationModel from "../auth/models/completeRegistration";

export default {
  findAll: async () => {
    return UserModel.findAll()
  },

  findOne: async where => {
    const user = await UserModel.findOne({where})

    if(!user) {
      throw new ApiException(404, 'User wasn\'t found')
    }

    return user
  },

  create: async data => {
    return UserModel.create(data)
  },

  completeRegistration: async (data, userId) => {
    const result = await mysql.transaction(async transaction => {
      const registration = await CompleteRegistrationModel.findOne({where: {userId, token: data.token}, transaction})

      if(!registration) {
        throw new ApiException(403, 'Url for complete registration was expired')
      }

      const user = await UserModel.update(data, {where: {id: userId}, returning: true, transaction})
      await registration.destroy({transaction})

      return user
    })

    return result
  },

  createByEmail: async (employers, companyId) => {
    const result = await mysql.transaction(async transaction => {
      const userInstance = await CompanyModel.bulkCreate(employers.map(E => ({...E, companyId})), {returning: true, transaction})
      return userInstance
    })

    return result
  }
}
