import bCrypt from 'bcrypt'
import UserModel from '../../users/user.model'
import RoleModel from "../../roles/role.model"
import ApproachModel from "../../approaches/approach.model"
import TokenModel from '../models/token'
import ApiException from '../../../exceptions/api'

export default {
  findBy: async params => {
    const user = await UserModel.scope('withPasswordAndRefreshToken')
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
          },
          {
            model: TokenModel,
            as: 'tokens',
            attributes: ['id', 'refreshToken']
          }
        ]
      })

    if(!user) {
      throw new ApiException(400, 'Invalid password or email')
    }

    return user
  },

  checkPasswords: (firstPassword, secondPassword) => {
    const passwordIsValid = bCrypt.compareSync(firstPassword, secondPassword)

    if (!passwordIsValid) {
      throw new ApiException(400, 'Invalid password or email')
    }
  },
}
