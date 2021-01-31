import SpecialistService from './specialist.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  findMySpecialists: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number()
      }))

      const specialists = await SpecialistService.findSpecialistsByUser(formattedData.userId)
      res.send(specialists)
    } catch(error) {
      next(error)
    }
  },

  publicFindMySpecialists: async (req, res, next) => {
    try {
      const formattedData = {
        companyId: req.query.companyId
      }

      validate(formattedData, joi.object().keys({
        companyId: joi.number().required()
      }))

      const specialists = await SpecialistService.findByCompanyId(formattedData.companyId)
      res.send(specialists)
    } catch(error) {
      next(error)
    }
  }
}
