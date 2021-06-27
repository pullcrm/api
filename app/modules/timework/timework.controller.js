import joi from "joi"
import TimeWorkService from './timework.service'
import validate from "../../utils/validate"

export default {
  update: async (req, res, next) => {
    try {
      const formattedData = {
        monday: req.body.monday,
        tuesday: req.body.tuesday,
        wednesday: req.body.wednesday,
        thursday: req.body.thursday,
        friday: req.body.friday,
        saturday: req.body.saturday,
        sunday: req.body.sunday,
      }

      const params = {
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        monday: joi.string(),
        tuesday: joi.string(),
        wednesday: joi.string(),
        thursday: joi.string(),
        friday: joi.string(),
        saturday: joi.string(),
        sunday: joi.string(),
        companyId: joi.number().required()
      }))

      const timeWork = await TimeWorkService.update(formattedData, params)
      res.send(timeWork)
    } catch (error) {
      next(error)
    }
  },

  publicFindTimeWork: async (req, res, next) => {
    try {
      const formattedData = {
        companyId: req.params.companyId
      }

      validate(formattedData, joi.object().keys({
        companyId: joi.number()
      }))

      const timeWork = await TimeWorkService.findOne(formattedData)
      res.send(timeWork)
    } catch (error) {
      next(error)
    }
  },
}
