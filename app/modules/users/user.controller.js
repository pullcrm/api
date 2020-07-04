import UserService from './user.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        offset: req.query.offset,
        limit: req.query.limit,
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
      }))

      const users = await UserService.findAll(formattedData)
      res.send(users)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        password: req.body.password,
        code: req.body.code,
        avatarId: req.body.avatarId
      }

      validate(formattedData, joi.object().keys({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phone: joi.string().required(),
        password: joi.string().required(),
        code: joi.number().required(),
        avatarId: joi.number().optional()
      }))

      const user = await UserService.create(formattedData)
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

      res.send(await UserService.findOne({id: formattedData.userId}))
    } catch(error) {
      next(error)
    }
  },

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
      }

      validate(formattedData, joi.object().keys({
        phone: joi.string().required(),
      }))

      res.send(await UserService.sendConfirmationCode(formattedData))
    } catch(error) {
      next(error)
    }
  }
}
