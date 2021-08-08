import FileService from "./file.service"
import validate from "../../utils/validate"
import joi from "joi"
import specialistService from "../specialists/specialist.service"

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

      validate(
        formattedData,
        joi.object().keys({
          offset: joi.number(),
          limit: joi.number(),
          userId: joi.number().required(),
          companyId: joi.number().required(),
          group: joi.string(),
        })
      )

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
        group: req.query.group,
      }

      validate(
        formattedData,
        joi.object().keys({
          offset: joi.number(),
          limit: joi.number(),
          userId: joi.number().required(),
          companyId: joi.number().optional(),
          group: joi.string(),
        })
      )

      const files = await FileService.findFiles(formattedData)
      res.send(files)
    } catch (error) {
      next(error)
    }
  },

  createMultiple: async (req, res, next) => {
    try {
      const formattedData = req.files.map(file => {
        return {
          file: {
            ...file,
            sizes: file.sizes.join(","),
            path: `${file.destination.replace("uploads", "")}/${
              file.sizes[0]
            }x${file.filename}`,
            destination: file.destination.replace("uploads", ""),
          },

          group: req.body.group,
        }
      })

      const params = {
        uploadBy: req.userId,
        userId: req.body.userId,
        companyId: req.companyId,
      }

      validate(
        {files: formattedData, ...params},
        joi.object().keys({
          files: joi.array().items({
            file: joi
              .object()
              .keys({
                filename: joi.string().required(),
                mimetype: joi.string().required(),
                path: joi.string().required(),
                size: joi
                  .number()
                  .integer()
                  .max(500000)
                  .error(new Error(`Resized file shoud be less than 500k`)),
              })
              .unknown()
              .required(),
            group: joi.string().optional(),
          }),
          uploadBy: joi.number().required(),
          userId: joi.number().required(),
          companyId: joi.number().optional(),
        })
      )

      const files = await FileService.createMultiple(formattedData, params)
      res.send(files)
    } catch (error) {
      next(error)
    }
  },

  destroy: async (req, res, next) => {
    try {
      const params = {
        fileId: req.params.id,
        companyId: req.companyId,
        userId: req.userId,
      }

      validate(
        params,
        joi.object().keys({
          fileId: joi.number().required(),
          companyId: joi.number().required(),
          userId: joi.number().required(),
        })
      )

      res.send(await FileService.destroy(params))
    } catch (error) {
      next(error)
    }
  },
}
