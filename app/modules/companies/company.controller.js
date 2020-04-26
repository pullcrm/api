import CompanyService from './company.service'
import validate from "../../utils/validate";
import joi from "joi";

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
        name: req.body.name,
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().required(),
      }));

      const company = await CompanyService.create(formattedData)
      res.send(company)
    } catch(error) {
      next(error)
    }
  }
}
