import UserService from './user.service'

export default {
  index: async (req, res, next) => {
    try {
      const users = await UserService.findAll({})
      res.send(users)
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

      const user = await UserService.create(formattedData)
      res.send(user)
    } catch(error) {
      next(error)
    }
  }
}
