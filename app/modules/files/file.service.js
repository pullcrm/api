import {mysql} from '../../config/connections'
import FileModel from './file.model'
import UserModel from '../users/user.model'

export default {
  findMyFiles: async ({userId}) => {
    return FileModel.findAll({
      include: [
        {model: UserModel, where: {id: userId}, attributes: [], required: true}
      ]
    })
  },

  upload: async (data, {userId, companyId}) => {
    const result = await mysql.transaction(async transaction => {
      const file = await FileModel.create({...data.file, companyId}, {returning: true, transaction})
      await file.setUsers([userId], {transaction})
      return file
    })

    return  result 
  }
}
