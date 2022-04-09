import BalanceService from './balance.service'
import validate from "../../utils/validate"
import joi from "../../utils/joi"

export default {
  getBalance:  async (req, res, next) => {
    try {
      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate(params, joi.object().keys({
        userId: joi.number().required(),
        companyId: joi.number().required()
      }))

      const balance = await BalanceService.getBalance(params)
      res.send(balance)
    } catch(error) {
      next(error)
    }
  },
  checkout: async (req, res, next) => {
    try {
      const formattedData = {
        amount: req.body.amount,
      }

      const params = {
        userId: req.userId,
        companyId: req.companyId
      }

      validate({...formattedData, ...params}, joi.object().keys({
        amount: joi.number().positive().required(),
        userId: joi.number().required(),
        companyId: joi.number().required()
      }))

      const balance = await BalanceService.checkout(formattedData, params)
      res.send(balance)
    } catch(error) {
      next(error)
    }
  },

  redirectUrl:  async (req, res, next) => {
    try {
      const formattedData = {
        data: req.body.data,
        signature: req.body.signature
      }

      validate(formattedData, joi.object().keys({
        data: joi.string().required(),
        signature: joi.string().required()
      }))
      
      const status = await BalanceService.getPaymentInfo(formattedData)
      res.redirect(`${process.env.CLIENT}/payment/${status}`)
    } catch(error) {
      next(error)
    }
  }
}
