import UserModel from '../users/user.model'
import ApiException from "../../exceptions/api";

export default {
  findByEmail: (email) => {
    return UserModel.findOne({email})
  },

  findById: (id) => {
    return UserModel.findOne({id})
  }
}
