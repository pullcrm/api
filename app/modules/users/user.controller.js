import UserService from './user.service'
import validate from "../../utils/validate";
import joi from "joi";

import ApiException from "../../exceptions/api"

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
      }));

      const user = await UserService.findOne({id: formattedData.userId})

      if (!user) {
        throw new ApiException(401, 'User not found')
      }

      res.send(user)
    } catch(error) {
      next(error)
    }
  }
}
