import joi from "joi"
import TimeWorkService from './timework.service'
import validate from "../../utils/validate"

export default {
  update: async (req, res, next) => {
    try {
      const formattedData = {
        monStart: req.body.monStart,
        monEnd: req.body.monEnd,
        tueStart: req.body.tueStart,
        tueEnd: req.body.tueyStart,
        wedStart: req.body.wedStart,
        wedEnd: req.body.wedEnd,
        thuStart: req.body.thuStart,
        thuEnd: req.body.thuEnd,
        friStart: req.body.friStart,
        friEnd: req.body.friEnd,
        satStart: req.body.satStart,
        satEnd: req.body.satEnd,
        sunStart: req.body.sunStart,
        sunEnd: req.body.sunEnd,
      }

      const params = {
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        monStart: joi.string(),
        monEnd: joi.string(),
        tueStart: joi.string(),
        tueEnd: joi.string(),
        wedStart: joi.string(),
        wedEnd: joi.string(),
        thuStart: joi.string(),
        thuEnd: joi.string(),
        friStart: joi.string(),
        friEnd: joi.string(),
        satStart: joi.string(),
        satEnd: joi.string(),
        sunStart: joi.string(),
        sunEnd: joi.string(),
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
