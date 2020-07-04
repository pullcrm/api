import cryptoRandomString from 'crypto-random-string'
import UserModel from './user.model'
import ApiException from "../../exceptions/api"
import {mysql} from "../../config/connections"
import ConfirmationModel from "../auth/models/confirmation"
import SMS from '../../providers/smsc'

export default {
  findAll: async () => {
    return UserModel.findAll()
  },

  findOneByPhone: async ({phone}) => {
    return UserModel.findOne({where: {phone}, raw: true})
  },

  findOne: async where => {
    const user = await UserModel.findOne({where})

    if(!user) {
      throw new ApiException(404, 'User wasn\'t found')
    }

    return user
  },
  sendConfirmationCode: async ({phone}) => {
    const user = await UserModel.findOne({where: {phone}}, {raw: true})

    if(user) {
      throw new ApiException(404, 'There is such phone')
    }

    const confirmation = await ConfirmationModel.create({
      code: cryptoRandomString({length: 4, type: 'numeric'}),
      phone
    })

    await SMS.send(phone,`Код PullCRM: ${confirmation.code}`)

    return {message: 'OK'}
  },

  create: async data => {
    const result = await mysql.transaction(async transaction => {
      const confirmation = await ConfirmationModel.findOne({where: {phone: data.phone, code: data.code}, transaction})

      if(!confirmation) {
        throw new ApiException(403, 'Code for completing the registration is not correct')
      }

      const user = await UserModel.create(data, {returning: true, transaction})
      await confirmation.destroy({transaction})

      return user
    })

    return result
  },

  update: async (data, {userId}) => {
    const user = await UserModel.findOne({where: {id: userId}})

    if(!user) {
      throw new ApiException(404, 'User wasn\'t found')
    }

    return user.update(data, {returning: true})
  },
}
