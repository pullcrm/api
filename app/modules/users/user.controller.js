import UserService from './user.service'

import joi from "../../utils/joi"
import validate from "../../utils/validate"
import {FAST_REGISTRATION, REGISTRATION, RESET_PASSWORD} from '../../constants/redis'

export default {
  create: async (req, res, next) => {
    try {
      const formattedData = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        password: req.body.password,
        code: req.body.code,
        avatarId: req.body.avatarId
      }

      validate(formattedData, joi.object().keys({
        fullName: joi.string().max(255).required(),
        phone: joi.string().pattern(/^0\d+$/).length(10).required(),
        password: joi.string().max(255).required(),
        code: joi.string().max(4).required(),
        avatarId: joi.number().optional()
      }))

      const user = await UserService.findOrCreate(formattedData)
      res.send(user)
    } catch(error) {
      next(error)
    }
  },

  profile: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number().required(),
      }))

      res.send(await UserService.profile(formattedData))
    } catch(error) {
      next(error)
    }
  },

  //TODO: Make fultext dynamic searching
  search: async (req, res, next) => {
    try {
      const formattedData = {
        phone: req.query.phone,
      }

      validate(formattedData, joi.object().keys({
        phone: joi.string()
      }))

      res.send(await UserService.findOneByPhone(formattedData))

    } catch (error) {
      next(error)
    }
  },

  sendConfirmationCode: async (req, res, next) => {
    try {
      const formattedData = {
        phone: req.body.phone,
        type: req.body.type
      }

      validate(formattedData, joi.object().keys({
        phone: joi.string().pattern(/^0\d+$/).length(10).required(),
        type: joi.string().valid(REGISTRATION, RESET_PASSWORD, FAST_REGISTRATION)
      }))

      res.send(await UserService.sendConfirmationCode(formattedData))
    } catch(error) {
      next(error)
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const formattedData = {
        phone: req.body.phone,
        newPassword: req.body.newPassword,
        code: req.body.code,
      }

      validate(formattedData, joi.object().keys({
        phone: joi.string().pattern(/^0\d+$/).length(10).required(),
        newPassword: joi.string().max(255).required(),
        code: joi.string().max(4).required(),
      }))

      const user = await UserService.resetPassword(formattedData)
      
      res.send(user) 
    } catch(error) {
      next(error)
    }
  },

  finishRegistration: async (req, res, next) => {
    try {
      const formattedData = {
        password: req.body.password,
        token: req.body.token,
      }

      validate(formattedData, joi.object().keys({
        password: joi.string().max(255).required(),
        token: joi.string().max(6).required(),
      }))

      const tokens = await UserService.finishRegistration(formattedData)
      res.send(tokens)
    } catch(error) {
      next(error)
    }
  },
}
