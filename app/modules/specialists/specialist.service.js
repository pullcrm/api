import SpecialistModel from './specialist.model'
import CompanyModel from "../companies/models/company"
import RoleModel from "../roles/role.model"
import UserModel from '../users/user.model'
import CategoryModel from "../categories/category.model"
import CityModel from "../cities/city.model"
import FileModel from '../files/file.model'
import ApiException from '../../exceptions/api'
import CompanySettingsModel from '../companies/models/settings'
import {ALL} from '../../constants/specialists'

export default {
  findAll: async ({companyId}) => {
    return SpecialistModel.findAll({companyId})
  },

  create: async data => {
    return SpecialistModel.create(data)
  },

  checkBy: async params => {
    const specialist = await SpecialistModel.findOne({where: params})

    if (!specialist) {
      throw new ApiException(403, 'You don\'t have permissions for that operation')
    }
  },

  activeCompany: async companyId => {
    const specialist = await SpecialistModel.findOne({where: companyId,
      include: [{
        model: CompanyModel
      }]
    })

    if(!specialist) {
      return {id: 0}
    }

    return specialist.company
  },

  findSpecialistsByUser: async userId => {
    const specialists = await SpecialistModel.findAll({
      where: {userId},
      attributes: {exclude: ['companyId', 'userId', 'roleId']},
      include: [{
        model: CompanyModel,
        attributes: {exclude: ['categoryId', 'userId', 'cityId']},
        include: [
          {model: CategoryModel},
          {model: CityModel},
          {model: CompanySettingsModel},
          {model: FileModel, as: 'logo'}
        ]
      },
      {model: RoleModel},
      {model: UserModel, include: {
        model: FileModel,
        as: 'avatar'
      }}]})
    
    return specialists
  },

  findByCompanyId: async companyId => {
    const specialists = await SpecialistModel.findAll({
      where: {companyId, status: ALL},
      attributes: {exclude: ['companyId', 'userId', 'roleId', 'status']},
      include: [{
        model: UserModel,
        attributes: ['firstName', 'lastName'],
        include: {
          model: FileModel,
          as: 'avatar'
        }
      }]
    })
    
    return specialists
  },

  update: async (data, params) => {
    const specialist = await SpecialistModel.findOne({where: {id: params.userId, companyId: params.companyId}})

    if(!specialist) {
      throw new ApiException(404, 'Specialist wasn\'t found')
    }

    return specialist.update(data)
  }
}