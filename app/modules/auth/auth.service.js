import UserModel from '../users/user.model'
import RoleModel from "../roles/role.model"
import ApproachModel from "../approaches/approach.model"

export default {
  findBy: params => {
    return UserModel.scope('withPasswordAndRefreshToken')
      .findOne({
        where: params,
        include: [
          {
            model: ApproachModel,
            required: false,
            attributes: ['companyId'],
            include: {
              model: RoleModel,
              attributes: ['name']
            },
          }
        ]
      })
  }
}
