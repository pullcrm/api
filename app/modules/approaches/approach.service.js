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

  checkBy: async params => {
    const approach = await ApproachModel.findOne({where: params})

    if (!approach) {
      throw new ApiException(403, 'You don\'t have permissions for that operation')
    }
  },

  activeCompany: async companyId => {
    const approach = await ApproachModel.findOne({where: companyId,
      include: [{
        model: CompanyModel
      }]
    })

    if(!approach) {
      return {id: 0}
    }

    return approach.company
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
  },

  update: async (data, params) => {
    const employee = await ApproachModel.findOne({where: {userId: params.userId, companyId: params.companyId}})

    if(!employee) {
      throw new ApiException(404, 'Employee wasn\'t found')
    }

    return employee.update(data)
  }
}