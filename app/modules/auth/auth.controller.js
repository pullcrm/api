import 'dotenv/config'
import joi from 'joi'
import AuthService from './services/auth'
import SpecialistService from '../specialists/specialist.service'
import RoleService from '../roles/role.service'
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from '../../utils/token'
import validate from "../../utils/validate"
import TokenService from './services/token'

export default {
  login: async (req, res, next) => {
    try {
      const formattedData = {
        phone: req.body.phone,
        password: req.body.password
      }

      validate(formattedData, joi.object().keys({
        phone: joi.string().pattern(/^0\d+$/).length(10).required(),
        password: joi.string().max(256).required()
      }))

      const user = await AuthService.findBy({phone: formattedData.phone})
      const userId = user.get('id')
      const activeCompany = await SpecialistService.activeCompany(userId)

      AuthService.checkPasswords(formattedData.password, user.password)

      const accessToken = generateAccessToken(userId, activeCompany.id)
      const refreshToken = generateRefreshToken(userId)

      await TokenService.create(refreshToken, userId)
      await TokenService.leaveFiveTokens(userId)

      res.send({accessToken, refreshToken})
    } catch (error) {
      next(error)
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const
        refreshToken = req.body.refreshToken,
        companyId = req.body.companyId,
        roleName = req.body.role,
        userId = req.body.userId

      validate({refreshToken, companyId, roleName, userId}, joi.object().keys({
        refreshToken: joi.string().required(),
        companyId: joi.number().required(),
        roleName: joi.string().required(),
        userId: joi.number().required(),
      }))

      verifyRefreshToken(refreshToken)

      const role = await RoleService.findBy({name: roleName})

      await TokenService.checkRefreshToken(refreshToken, userId)
      await SpecialistService.checkBy({companyId, roleId: role.id, userId})

      const accessToken = generateAccessToken(userId, companyId, roleName)
      const newRefreshToken = generateRefreshToken(userId)

      await TokenService.create(newRefreshToken, userId)
      await TokenService.leaveFiveTokens(userId)

      res.status(200).send({accessToken, refreshToken: newRefreshToken})
    } catch (error) {
      next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      const userId = req.userId
      await TokenService.deactivateRefreshTokens(userId)
  
      res.json({logout: true})
    } catch(error) {
      next(error)
    }
  }
}
