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
  },

  findMyApproaches: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number()
      }))

      const roles = await ApproachService.findMyApproaches(formattedData.userId)
      res.send(roles)
    } catch(error) {
      next(error)
    }
  },

  findMyCurrentApproaches: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number(),
        companyId: joi.number()
      }))

      const Approaches = await ApproachService.findMyApproaches(formattedData.userId)
      const current = Approaches.find(({id}) => id === formattedData.companyId)

      res.send(current)
    } catch(error) {
      next(error)
    }
  },
}
