import UserService from './user.service'

export default {
  index: async (req, res, next) => {
    try {
      const users = await UserService.findAll({})
      res.send(users)
    } catch(error) {
      next(error)
    }
  }
}
