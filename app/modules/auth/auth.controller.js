import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import joi from 'joi'
import AuthService from './auth.service'
import ApproachService from '../approaches/approach.service'
import RoleService from '../roles/role.service'
import ApiException from "../../exceptions/api"
import {createAccessToken, createRefreshToken} from '../../utils/createTokens'
import validate from "../../utils/validate"

export default {
  login: async (req, res, next) => {
    try {
      const formattedData = {
        phone: req.body.phone,
        password: req.body.password
      }

      validate(formattedData, joi.object().keys({
        phone: joi.string().max(10).required(),
        password: joi.string().max(256).required()
      }))

      const user = await AuthService.findBy({phone: formattedData.phone})

      if(!user) {
        throw new ApiException(401, 'Invalid password or email')
      }

      const passwordIsValid = bCrypt.compareSync(formattedData.password, user.password)

      if (!passwordIsValid) {
        throw new ApiException(401, 'Invalid password or email')
      }

      //TODO last company is't a good, should be last usage company
      // const approaches = user.get('approaches', {plain: true})
      // const lastApproach = approaches[approaches.length - 1]

      const {accessToken, expiresIn} = createAccessToken(user.id)
      const refreshToken = createRefreshToken(user.get({plain: true}))

      user.refreshToken = refreshToken

      await user.save()

      res.send({accessToken, refreshToken, expiresIn})
    } catch (error) {
      next(error)
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const formattedData = {
        //TODO refreshToken should be httpOnly
        refreshToken: req.body.refreshToken,
        companyId: req.body.companyId,
        role: req.body.role
      }

      validate(formattedData, joi.object().keys({
        refreshToken: joi.string().required(),
        companyId: joi.number().required(),
        role: joi.string().required(),
      }))

      const payload = jwt.verify(formattedData.refreshToken, process.env.SECRET_REFRESH_FOR_JWT)
      const userId = payload.userId
      const user = await AuthService.findBy({id: userId})

      //TODO may need to handle different devices in future
      if (user.refreshToken !== formattedData.refreshToken) {
        console.log('74', user.refreshToken, formattedData.refreshToken)
        throw new ApiException(403, 'Failed to authenticate refresh token')
      }

      const role = await RoleService.findBy({name: formattedData.role})

      const hasApproach = await ApproachService.hasRow({companyId: formattedData.companyId, roleId: role.id, userId})

      if (!hasApproach) {
        console.log('84', hasApproach, formattedData.companyId, role.id, userId)
        throw new ApiException(403, 'You don\'t have permissions for that operation')
      }

      const {accessToken, expiresIn} = createAccessToken(user.id, formattedData.companyId, role.name)

      res.status(200).send({accessToken, expiresIn})

    } catch (error) {
      console.log('ERROR:', error)
      next(error)
    }
  },

  logout: (req, res) => {
    //TODO need deactivate tokens that not expired
    res.json({logout: true})
  }
}
