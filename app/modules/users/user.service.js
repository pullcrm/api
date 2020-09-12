import cryptoRandomString from 'crypto-random-string'
import UserModel from './user.model'
import ApiException from "../../exceptions/api"
import SMS from '../../providers/smsc'
import TokenService from '../auth/services/token'
import {client as redis} from '../../providers/redis'
import FileModel from '../files/file.model'
import {RESET_PASSWORD, REGISTRATION} from '../../constants/redis'

export default {
  findOneByPhone: async ({phone}) => {
    return UserModel.findOne({where: {phone}, include: {model: FileModel, as: 'avatar'}, attributes: {exclude: ['avatarId']}})
  },

  findOne: async where => {
    const user = await UserModel.findOne({where, include: {model: FileModel, as: 'avatar'}, attributes: {exclude: ['avatarId']}})

    if(!user) {
      throw new ApiException(404, 'User wasn\'t found')
    }

    return user
  },
  
  sendConfirmationCode: async ({phone, type}) => {
    const code = cryptoRandomString({length: 4, type: 'numeric'}) 

    redis.hmset(`${type}-${phone}`, {
      code,
      type,
      phone
    })

    redis.expire(`${type}-${phone}`, 1800)

    return SMS.sendSms({
      phones: phone,
      mes: `Код PullCRM: ${code}`
    })
  },

  create: async data => {
    const registrationKey = `${REGISTRATION}-${data.phone}`
    const confirmation = await redis.hgetall(registrationKey)

    if(!confirmation) {
      throw new ApiException(403, 'Code for completing the registration is not correct')
    }

    if(confirmation.code !== data.code || confirmation.phone !== data.phone) {
      throw new ApiException(403, 'Code or phone is not correct')
    }

    redis.del(registrationKey)

    return UserModel.create(data, {returning: true})
  },

  resetPassword: async ({phone, newPassword, code}) => {
    const resetPasswordKey = `${RESET_PASSWORD}-${phone}`
    const confirmation = await redis.hgetall(resetPasswordKey)

    if(!confirmation) {
      throw new ApiException(403, 'Code for reseting password is not correct')
    }

    if(confirmation.code !== code || confirmation.phone !== phone) {
      throw new ApiException(403, 'Code or phone is not correct')
    }

    const user = await UserModel.findOne({where: {phone}})

    if(!user) {
      throw new ApiException(404, 'User was not found')
    }

    redis.del(resetPasswordKey)
    await TokenService.deactivateRefreshTokens(user.id)

    return user.update({password: newPassword})
  },

  update: async (data, {userId}) => {
    const user = await UserModel.findOne({where: {id: userId}})

    if(!user) {
      throw new ApiException(404, 'User wasn\'t found')
    }

    return user.update(data, {returning: true})
  },
}
