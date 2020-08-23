import 'dotenv/config'
import joi from 'joi'
import AuthService from './services/auth'
import ApproachService from '../approaches/approach.service'
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
        phone: joi.string().max(10).required(),
        password: joi.string().max(256).required()
      }))

      const user = await AuthService.findBy({phone: formattedData.phone})
      const userId = user.get('id')

      AuthService.checkPasswords(formattedData.password, user.password)

      const accessToken = generateAccessToken(userId)
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
      await ApproachService.checkApproach(companyId, role.id, userId)

      const accessToken = generateAccessToken(userId, companyId, roleName)

      res.status(200).send({accessToken})
    } catch (error) {
      next(error)
    }
  },

  logout: (req, res) => {
    //TODO need deactivate tokens that not expired
    res.json({logout: true})
  }
}
