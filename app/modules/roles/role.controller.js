import RoleService from './role.service'
import validate from "../../utils/validate";
import joi from "joi";

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        offset: req.query.offset,
        limit: req.query.limit,
        companyId: req.companyId
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        companyId: joi.string().max(256).required()
      }));

      const roles = await RoleService.findAll(formattedData)
      res.send(roles)
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
        name: joi.string().max(256).required()
      }));

      const role = await RoleService.create(formattedData)
      res.send(role)
    } catch(error) {
      next(error)
    }
  }
}