import FileService from './file.service'
import validate from "../../utils/validate"
import joi from "joi"
import specialistService from '../specialists/specialist.service'

export default {
  getUserFiles: async (req, res, next) => {
    try {
      const formattedData = {
        offset: req.query.offset,
        limit: req.query.limit,
        group: req.query.group,
        userId: req.params.id,
        companyId: req.companyId,
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        userId: joi.number().required(),
        companyId: joi.number().required(),
        group: joi.string()
      }))

      const files = await FileService.findFiles(formattedData)
      res.send(files)
    } catch (error) {
      next(error)
    }
  },

  findMyFiles: async (req, res, next) => {
    try {
      const formattedData = {
        offset: req.query.offset,
        limit: req.query.limit,
        userId: req.userId,
        companyId: req.companyId,
        group: req.query.group
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        userId: joi.number().required(),
        companyId: joi.number().optional(),
        group: joi.string()
      }))

      const files = await FileService.findFiles(formattedData)
      res.send(files)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        file: {
          ...req.file,
          sizes: req.file.sizes.join(','),
          path: `${req.file.destination.replace('uploads', '')}/${req.file.sizes[0]}x${req.file.filename}`,
          destination: req.file.destination.replace('uploads', '')
        },
       
        group: req.body.group
      }

      const params = {
        uploadBy: req.userId,
        userId: req.body.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        file: joi.object().keys({
          filename: joi.string().required(),
          mimetype: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().integer().max(500000).error(new Error(`Resized file shoud be less than 500k, but it ${req.file.size/1000}k`))
        }).unknown().required(),
        uploadBy: joi.number().required(),
        userId: joi.number().required(),
        companyId: joi.number().optional(),
        group: joi.string().optional()
      }))

      const file = await FileService.create(formattedData, params)
      res.send(file)
    } catch(error) {
      next(error)
    }
  },

  destroy: async (req, res, next) => {
    try {
      const params = {
        fileId: req.params.id,
        companyId: req.companyId,
        userId: req.userId
      }

      validate(params, joi.object().keys({
        fileId: joi.number().required(),
        companyId: joi.number().required(),
        userId: joi.number().required()
      }))

      res.send(await FileService.destroy(params))
    } catch (error) {
      next(error)
    }
  },
}
