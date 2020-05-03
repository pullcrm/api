import joi from "joi";
import validate from "../../utils/validate";
import CompanyService from './company.service'

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        offset: req.query.offset,
        limit: req.query.limit,
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
      }));

      const companies = await CompanyService.findAll(formattedData)
      res.send(companies)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        company: {
          ...req.body.company,
          userId: req.userId
        },
        employers: req.body.employers || [],
        procedures: req.body.procedures || [],
      }

      validate(formattedData, joi.object().keys({
        company: joi.object().keys({
          name: joi.string().required(),
          city: joi.string().required(),
          type: joi.string().required(),
          userId: joi.number().required()
        }).required(),

        employers: joi.array().items(
          joi.object().keys({
            email: joi.string().required()
          }).optional()
        ).optional(),

        procedures: joi.array().items(
          joi.object().keys({
            name: joi.string().required(),
            price: joi.number().required(),
            duration: joi.date().timestamp()
          }).optional()
        ).optional(),
      }));

      const company = await CompanyService.create(formattedData)
      res.send(company)
    } catch(error) {
      next(error)
    }
  },
}


