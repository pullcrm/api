import {RESET_PASSWORD, REGISTRATION} from "../../constants/redis"
import {makeRandom} from "../../utils/make-random"
import ApiException from "../../exceptions/api"
import {client as redis} from "../../providers/redis"
import TokenService from "../auth/services/token"
import SMSGlobalService from "../sms/services/sms.global"
import UserModel from "./user.model"
import FileModel from "../files/file.model"
import CompanyModel from "../companies/models/company"
import CityModel from "../cities/city.model"
import WidgetSettingsModel from "../widget/models/settings.model"
import RoleModel from "../roles/role.model"
import SpecialistModel from "../specialists/specialist.model"
import TypeModel from "../companies/models/types"
import SMSSettingsModel from "../sms/models/settings.model"
import ValidationException from "../../exceptions/validation"

const SMS_CLIENT_SEND_REAL_SMS = process.env.SMS_CLIENT_SEND_REAL_SMS

export default {
  findOneByPhone: async ({phone}) => {
    return UserModel.findOne({
      where: {phone},
      include: {model: FileModel, as: "avatar"},
      attributes: {exclude: ["avatarId"]},
    })
  },

  profile: async ({userId}) => {
    const user = await UserModel.findOne({
      where: {id: userId},
      order: [
        [SpecialistModel, 'id', 'desc']
      ],
      include: [
        {
          model: SpecialistModel,
          include: [
            {model: RoleModel},
            {
              model: CompanyModel,
              attributes: {exclude: ["typeId", "userId", "cityId"]},
              include: [
                {model: TypeModel},
                {model: CityModel},
                {model: WidgetSettingsModel},
                {model: SMSSettingsModel},
                {
                  model: FileModel,
                  as: "logo",
                  attributes: {exclude: ["logoId"]},
                },
              ],
            },
          ],
        },
        {
          model: FileModel,
          as: "avatar",
          attributes: {exclude: ["avatarId"]},
        },
      ],
    })

    if (!user) {
      throw new ApiException(404, "User wasn't found")
    }

    return user
  },

  sendConfirmationCode: async ({phone, type}) => {
    if(type === RESET_PASSWORD) {
      const user = await UserModel.findOne({where: {phone}})

      if (!user) {
        return {
          result: true,
        }
      }
    }

    let code = makeRandom(4, {type: "numeric"})

    if (SMS_CLIENT_SEND_REAL_SMS === "false") {
      code = phone.substring(6, 10) /* Get last 4 digits from phone */
    }

    await redis.hmset(`${type}-${phone}`, {
      code,
      type,
      phone,
    })

    await redis.expire(`${type}-${phone}`, 1800)

    if (SMS_CLIENT_SEND_REAL_SMS === "false") {
      return {
        result: true,
      }
    }

    return SMSGlobalService.send({
      phone,
      message: `Код: ${code}`,
    })
  },

  create: async data => {
    const registrationKey = `${REGISTRATION}-${data.phone}`
    const confirmation = await redis.hgetall(registrationKey)

    if (!confirmation) {
      throw new ValidationException("code", "Код для добавления сотрудника неверный")
    }

    if (confirmation.code !== data.code || confirmation.phone !== data.phone) {
      throw new ValidationException("code", "Код для добавления сотрудника неверный")
    }

    await redis.del(registrationKey)

    return UserModel.create(data, {returning: true})
  },

  resetPassword: async ({phone, newPassword, code}) => {
    const resetPasswordKey = `${RESET_PASSWORD}-${phone}`
    const confirmation = await redis.hgetall(resetPasswordKey)

    if (!confirmation) {
      throw new ValidationException("code", "Код для обновления пароля неверный")
    }

    if (confirmation.code !== code || confirmation.phone !== phone) {
      throw new ValidationException("code", "Код для обновления пароля неверный")
    }

    const user = await UserModel.findOne({where: {phone}})

    if (!user) {
      throw new ApiException(404, "User was not found")
    }

    await redis.del(resetPasswordKey)
    await TokenService.deactivateRefreshTokens(user.id)

    return user.update({password: newPassword})
  },

  update: async (data, userId) => {
    const user = await UserModel.findOne({where: {id: userId}})

    if (!user) {
      throw new ApiException(404, "User wasn't found")
    }

    return user.update(data, {returning: true})
  },
}
