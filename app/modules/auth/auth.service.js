import UserModel from '../users/user.model'
import ApiException from "../../exceptions/api";

export default {
  findByEmail: (email) => {
    return UserModel.findOne({email})
  },

  login: ({email, password}) => {

  },

  findById: (id) => {
    return UserModel.findOne({id})
  }
}
