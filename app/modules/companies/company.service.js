import {mysql} from '../../config/connections'
import CompanyModel from './models/company'
import ProcedureModel from "../procedures/procedure.model"
import UserModel from "../users/user.model"
import ApproachModel from "../approaches/approach.model"
import RoleModel from "../roles/role.model"
import CompleteRegistrationModel from "../auth/models/confirmation"
import cryptoRandomString from "crypto-random-string"
import CityModel from "../cities/city.model";
import CategoryModel from "../categories/category.model";

export default {
  findAll: async params => {
    return CompanyModel.findAll({where: {userId: params.userId}})
  },

  create: async data => {
    const company = await CompanyModel.create(data, {include: [{model: CityModel}, {model: CategoryModel}]})
    return company
  },

  // create: async ({company, procedures, employers}) => {
  //   const result = await mysql.transaction(async transaction => {
  //     const companyInstance = await CompanyModel.create(
  //       {
  //         ...company,
  //         procedures,
  //       },
  //       {
  //         include: [{model: ProcedureModel}], transaction
  //       }
  //     )
  //
  //     const users = await UserModel.bulkCreate(employers.map(E => ({...E, companyId: companyInstance.id})), {returning: true, transaction})
  //
  //     await CompleteRegistrationModel.bulkCreate(users.map(U => ({
  //       token: cryptoRandomString({length: 10, type: 'base64'}),
  //       userId: U.id
  //     })), {transaction})
  //
  //     const roles = await RoleModel.findAll({where: {name: ['INVITED', 'ADMIN']}, raw: true})
  //     const adminRole = roles.find(R => R.name === 'ADMIN')
  //     const invitedRole = roles.find(R => R.name === 'INVITED')
  //
  //     const bulkApproaches = users.map(U => ({userId: U.id, companyId: companyInstance.id, roleId: invitedRole.id}))
  //     bulkApproaches.push({userId: companyInstance.userId, companyId: companyInstance.id, roleId: adminRole.id})
  //
  //     await ApproachModel.bulkCreate(bulkApproaches, {transaction})
  //     return {...companyInstance.toJSON(), employers: users}
  //   })
  //
  //   return result
  // },

  findEmployers: async ({companyId, limit, offset}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})
    return company.getEmployers({limit, offset})
  }
}
