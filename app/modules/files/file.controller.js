import FileService from './file.service'
import validate from "../../utils/validate"
import joi from "joi"

export default {
  findMyFiles: async (req, res, next) => {
    try {
      const formattedData = {
        offset: req.query.offset,
        limit: req.query.limit,
        userId: req.userId,
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        userId: joi.number().required(),
        companyId: joi.number().optional()
      }))

      const files = await FileService.findMyFiles(formattedData)
      res.send(files)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        file: {...req.file, path: req.file.path.replace('uploads', '')}
      }

      console.log(req.file)

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        file: joi.object().keys({
          filename: joi.string().required(),
          mimetype: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().integer().max(500000).error(new Error('File shoud be less than 500k'))
        }).unknown().required(),
        userId: joi.number().required(),
        companyId: joi.number().optional()
      }))

      const file = await FileService.upload(formattedData, params)
      res.send(file)
    } catch(error) {
      next(error)
    }
  }
}
