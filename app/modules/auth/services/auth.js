import bCrypt from 'bcrypt'
import UserModel from '../../users/user.model'
import RoleModel from "../../roles/role.model"
import SpecialistModel from "../../specialists/specialist.model"
import TokenModel from '../models/token'
import ValidationException from '../../../exceptions/validation'

export default {
  findBy: async params => {
    const user = await UserModel.scope('withPasswordAndRefreshToken')
      .findOne({
        where: params,
        include: [
          {
            model: SpecialistModel,
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
      throw new ValidationException('*', 'Введений невірний номер телефону або ж пароль')
    }

    return user
  },

  checkPasswords: (firstPassword, secondPassword) => {
    const passwordIsValid = bCrypt.compareSync(firstPassword, secondPassword)

    if (!passwordIsValid) {
      throw new ValidationException('*', 'Введений невірний номер телефону або ж пароль')
    }
  },
}
