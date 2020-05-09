import UserService from './user.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  index: async (req, res, next) => {
    try {
      const users = await UserService.findAll({})
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
        email: req.body.email,
        password: req.body.password
      }

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
  }
}
