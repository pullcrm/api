import ApproachModel from './approach.model'
import CompanyModel from "../companies/models/company"
import RoleModel from "../roles/role.model"
import UserModel from '../users/user.model'
import CategoryModel from "../categories/category.model"
import CityModel from "../cities/city.model"
import FileModel from '../files/file.model'
import ApiException from '../../exceptions/api'
import SMSConfigurationModel from '../companies/models/smsConfiguration'

export default {
  findAll: async ({companyId}) => {
    return ApproachModel.findAll({companyId})
  },

  create: async data => {
    return ApproachModel.create(data)
  },

  checkApproach: async (companyId, roleId, userId) => {
    const approach = await ApproachModel.findOne({where: {companyId, roleId, userId}})

    if (!approach) {
      throw new ApiException(403, 'You don\'t have permissions for that operation')
    }
  },

  findMyApproaches: async userId => {
    const approaches = await ApproachModel.findAll({
      where: {userId},
      attributes: {exclude: ['companyId', 'userId', 'roleId']},
      include: [{
        model: CompanyModel,
        attributes: {exclude: ['categoryId', 'userId', 'cityId']},
        include: [
          {model: CategoryModel},
          {model: CityModel},
          {model: SMSConfigurationModel},
          {model: FileModel, as: 'logo'}
        ]
      },
      {model: RoleModel},
      {model: UserModel, include: {
        model: FileModel,
        as: 'avatar'
      }}]})
    
    return approaches
  }
}