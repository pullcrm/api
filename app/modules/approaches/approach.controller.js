import ApproachService from './approach.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  findMyApproaches: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number()
      }))

      const approaches = await ApproachService.findMyApproaches(formattedData.userId)
      res.send(approaches)
    } catch(error) {
      next(error)
    }
  },

  publicFindAllEmployees: async (req, res, next) => {
    try {
      const formattedData = {
        companyId: req.query.companyId
      }

      validate(formattedData, joi.object().keys({
        companyId: joi.number()
      }))

      const employees = await ApproachService.findByCompanyId(formattedData.companyId)
      res.send(employees)
    } catch(error) {
      next(error)
    }
  }
}
