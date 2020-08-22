import {mysql} from '../../config/connections'
import CompanyModel from './models/company'
import UserModel from "../users/user.model"
import ApproachModel from "../approaches/approach.model"
import RoleModel from "../roles/role.model"
import CityModel from "../cities/city.model"
import CategoryModel from "../categories/category.model"
import ApiException from "../../exceptions/api"
import ConfirmationModel from '../auth/models/confirmation'
import FileModel from '../files/file.model'

export default {
  findBy: async data => {
    const company = await CompanyModel.findOne({where: data, raw: true})

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

  addEmployee: async (data, params) => {
    const result = await mysql.transaction(async transaction => {
      const confirmation = await ConfirmationModel.findOne({where: {phone: data.phone, code: data.code}, transaction})

      if(!confirmation) {
        throw new ApiException(403, 'Code for completing the registration is not correct')
      }

      const user = await UserModel.create(data, {returning: true, transaction})
      const employeeRole = await RoleModel.findOne({where: {name: 'EMPLOYEE'}, raw: true, transaction})
      await ApproachModel.create({userId: user.id, companyId: params.companyId, roleId: employeeRole.id}, {transaction})
      await confirmation.destroy({transaction})

      return user
    })

    return result
  },

  findStaff: async ({companyId, limit, offset}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(!company) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    return company.getStaff({limit, offset, include: [{model: FileModel, as: 'avatar'}], attributes: {exclude: ['avatarId']}})
  }
}
