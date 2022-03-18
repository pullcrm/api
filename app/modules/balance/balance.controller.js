import BalanceService from './balance.service'
import validate from "../../utils/validate"
import joi from "../../utils/joi"

export default {
  checkout: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().max(255).required()
      }))

      const balance = await BalanceService.checkout(formattedData)
      res.send(balance)
    } catch(error) {
      next(error)
    }
  }
}
