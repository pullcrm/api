import {mysql} from '../../config/connections'
import CompanyModel from './models/company'
import ApproachModel from "../approaches/approach.model"
import RoleModel from "../roles/role.model"
import CityModel from "../cities/city.model"
import CategoryModel from "../categories/category.model"
import ApiException from "../../exceptions/api"
import FileModel from '../files/file.model'
import SMSConfigurationModel from '../sms/sms.model'

export default {
  findOne: async params => {
    const company = await CompanyModel.findOne({where: params, attributes: {exclude: ['categoryId', 'userId', 'cityId', 'logoId']},
      include: [
        {model: CategoryModel},
        {model: CityModel},
        {model: SMSConfigurationModel},
        {model: FileModel, as: 'logo'}
      ]})

    if(!company) {
      throw new ApiException(404, 'Company was not found')
    }

    return company
    
  },

  findAll: async params => {
    return CompanyModel.findAll({where: {userId: params.userId}})
  },

  create: async data => {
    const result = await mysql.transaction(async transaction => {
      const company = await CompanyModel.create(data, {include: [{model: CityModel}, {model: CategoryModel}], transaction})
      const adminRole = await RoleModel.findOne({where: {name: 'ADMIN'}, raw: true, transaction})
      await ApproachModel.create({userId: company.userId, companyId: company.id, roleId: adminRole.id}, {transaction})

      return company
    })

    return result
  },

  update: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(!company) {
      throw new ApiException(404, 'Company wasn\'t found')
    }

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'That is not your company')
    }

    const result = await mysql.transaction(async transaction => {
      await company.update(data, {plain: true, transaction})

      return company
    })

    return result
  },

  addEmployee: async (user, params, transaction) => {
    const employeeRole = await RoleModel.findOne({where: {name: 'EMPLOYEE'}, raw: true, transaction})
    return ApproachModel.create({userId: user.id, companyId: params.companyId, roleId: employeeRole.id}, {transaction})
  },

  findStaff: async ({companyId, limit, offset}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(!company) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    return company.getStaff({limit, offset, include: [{model: FileModel, as: 'avatar'}], attributes: {exclude: ['avatarId']}})
  },
}
