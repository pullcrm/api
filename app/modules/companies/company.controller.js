import joi from "joi"
import 'dotenv/config'
import validate from "../../utils/validate"
import CompanyService from './company.service'
import UserModel from "../users/user.model"
import CompleteRegistrationModel from "../auth/models/completeRegistration"
import Mailer from '../../providers/email'

export default {
  index: async (req, res, next) => {
    try {
      const formattedData = {
        userId: req.userId
      }

      validate(formattedData, joi.object().keys({
        userId: joi.number()
      }))

      const companies = await CompanyService.findAll(formattedData)
      res.send(companies)
    } catch (error) {
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
          cityId: joi.number().required(),
          categoryId: joi.number().required(),
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
      }))

      const company = await CompanyService.create(formattedData)

      const usersWithTokens = await UserModel.findAll({
        where: {id: company.employers.map(U => U.id)}, raw: true, nest: true, include: {
          model: CompleteRegistrationModel,
          as: 'completeRegistration',
          required: true
        }
      })

      await Promise.all(usersWithTokens.map(U => {
        Mailer.send({
          from: 'Pullcrm<b>',
          to: U.email,
          subject: 'You are invited to Pullcrm',
          text: 'url',
          html: `<div>Click on this link to continue registration ${process.env.CLIENT}/register?token=${U.completeRegistration.token}&userId=${U.id}\`</div>`
        })
      }))

      res.send(company)
    } catch (error) {
      next(error)
    }
  },

  findEmployers: async (req, res, next) => {
    try {
      const formattedData = {
        offset: +req.query.offset || 0,
        limit: +req.query.limit || 20,
        companyId: req.companyId,
      }

      validate(formattedData, joi.object().keys({
        offset: joi.number(),
        limit: joi.number(),
        companyId: joi.number(),
      }))

      const users = await CompanyService.findEmployers(formattedData)
      res.send(users)
    } catch (error) {
      next(error)
    }
  },
}

