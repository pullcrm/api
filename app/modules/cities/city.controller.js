import CityService from './city.service'
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

      const roles = await CityService.findAll(formattedData)
      res.send(roles)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().max(255).required()
      }))

      const role = await CityService.create(formattedData)
      res.send(role)
    } catch(error) {
      next(error)
    }
  }
}
