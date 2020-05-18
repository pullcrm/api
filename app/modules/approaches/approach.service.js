import ApproachModel from './approach.model'
import CompanyModel from "../companies/models/company"
import RoleModel from "../roles/role.model"
import UserModel from '../users/user.model'

export default {
  findAll: async ({companyId}) => {
    return ApproachModel.findAll({companyId})
  },

  create: async data => {
    return ApproachModel.create(data)
  },

  hasRow: async data => {
    const raw = await ApproachModel.findOne({where: data, raw: true})
    return Boolean(raw)
  },

  findMyApproaches: async userId => {
    console.log(userId)
    const approaches = await ApproachModel.findAll({where: {userId}, include: [{model: CompanyModel}, {model: RoleModel}, {model: UserModel}]})
    return approaches
  },
}
