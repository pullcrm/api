import BalanceService from './balance.service'
import validate from "../../utils/validate"
import joi from "../../utils/joi"

export default {
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
      
      const status = await BalanceService.getPaymentInfo(formattedData)
      res.redirect(`${process.env.CLIENT}/payment/${status}`)
    } catch(error) {
      next(error)
    }
  }
}
