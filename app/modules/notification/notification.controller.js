import validate from "../../utils/validate"
import joi from "joi"

import SMS from '../../services/smsc'

export default {
  balance: async (req, res, next) => {
    try {
      const params = {
        login: req.body.login,
        psw: req.body.password
      }

      validate(params, joi.object().keys({
        login: joi.string(),
        psw: joi.string()
      }))

      const result = await SMS.getBalance(params)

      res.send(result)
    } catch (error) {
      next(error)
    }
  }
}
