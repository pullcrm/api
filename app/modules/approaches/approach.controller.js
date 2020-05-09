import ApproachService from './approach.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        companyId: joi.number()
      }))

      const roles = await ApproachService.findAll(formattedData)
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
        name: joi.string().max(256).required()
      }))

      const role = await ApproachService.create(formattedData)
      res.send(role)
    } catch(error) {
      next(error)
    }
  }
}
