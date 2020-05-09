import RoleModel from './role.model'
import ApiException from "../../exceptions/api";

export default {
  findAll: async () => {
    return RoleModel.findAll()
  },

  findBy: async data => {
    const role = await RoleModel.findOne({where: data, raw: true})

    if(!role) {
      throw new ApiException(404, 'Role was not found')
    }

    return role
  },

  create: async data => {
    return RoleModel.create(data)
  }
}
