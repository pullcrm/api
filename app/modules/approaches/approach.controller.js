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

  findMyCurrentApproach: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number(),
        companyId: joi.number()
      }))

      const approach = await ApproachService.findMyCurrentApproach(formattedData)

      res.send(approach)
    } catch(error) {
      next(error)
    }
  },
}
