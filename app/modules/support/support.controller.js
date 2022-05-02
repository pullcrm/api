import SupportService from './support.service'
import validate from "../../utils/validate"
import joi from "../../utils/joi"

export default {
  sendMessage: async (req, res, next) => {
    try {
      const formattedData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        comment: req.body.comment,
      }

      validate(formattedData, joi.object().keys({
        name: joi.string().max(255).required(),
        email: joi.string().max(255).required(),
        phone: joi.string().max(255).required(),
        comment: joi.string().max(600).required()
      }))

      const message = await SupportService.sendMessage(formattedData)
      res.send(message)
    } catch(error) {
      next(error)
    }
  }
}
