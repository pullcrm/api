import UserModel from '../users/user.model'

export default {
  removeDemoUser: async (req, res, next) => {
    try {
      if(process.env.NODE_ENV !== 'development') {
        return res.send()
      }

      const user = await UserModel.findOne({where: {phone: '0111111111'}}) 

      if(!user) {
        return res.send({isDestroyed: false})
      }

      user.destroy({cascade: true})
      return res.send({isDestroyed: true})
    } catch(error) {
      next(error)
    }
  }
}
