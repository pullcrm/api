import AppointmentService from './appointments.service'
import validate from "../../utils/validate";
import joi from "joi";

import UserModel from "../users/user.model";
import CompanyModel from "../companies/company.model";

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        offset: req.query.offset,
        limit: req.query.limit,
        companyId: req.companyId
      }

    console.log(UserModel, CompanyModel)
      // validate(formattedData, joi.object().keys({
      //   offset: joi.number(),
      //   limit: joi.number(),
      //   companyId: joi.string().max(256).required()
      // }));

      const appointments = await AppointmentService.findAll(formattedData)
      res.send(appointments)
    } catch(error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const formattedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      }

      const user = await AppointmentService.create(formattedData)
      res.send(user)
    } catch(error) {
      next(error)
    }
  }
}
