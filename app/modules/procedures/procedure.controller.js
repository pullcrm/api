import ProceduresService from './procedure.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        offset: +req.query.offset || 0,
        limit: +req.query.limit || 20,
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        companyId: joi.number()
      }))

      const roles = await ProceduresService.findAll(formattedData)
      res.send(roles)
    } catch (error) {
      next(error)
    }
  },
}
