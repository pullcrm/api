import {mysql} from '../../config/connections'
import CompanyModel from './models/company'
import ProcedureModel from "../procedures/procedure.model"
import UserModel from "../users/user.model"
import ApproachModel from "../approaches/approach.model"
import RoleModel from "../roles/role.model"

export default {
  findAll: async params => {
    return CompanyModel.findAll({where: {userId: params.userId}})
  },

  create: async ({company, procedures, employers}) => {
    const result = await mysql.transaction(async transaction => {
      const companyInstance = await CompanyModel.create(
        {
          ...company,
          procedures,
        },
        {
          include: [{model: ProcedureModel}], transaction
        }
      )

      const users = await UserModel.bulkCreate(employers.map(E => ({...E, companyId: companyInstance.id})), {returning: true, transaction})
      const roles = await RoleModel.findAll({where: {name: ['INVITED', 'ADMIN']}, raw: true})
      const adminRole = roles.find(R => R.name === 'ADMIN')
      const invitedRole = roles.find(R => R.name === 'INVITED')

      const bulkApproaches = users.map(U => ({userId: U.id, companyId: companyInstance.id, roleId: invitedRole.id}))
      bulkApproaches.push({userId: companyInstance.userId, companyId: companyInstance.id, roleId: adminRole.id})

      await ApproachModel.bulkCreate(bulkApproaches, {transaction})
      return {...companyInstance.toJSON(), employers: users}
    })

    return result
  },
}
