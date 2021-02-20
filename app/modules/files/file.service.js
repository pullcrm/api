import {mysql} from '../../config/connections'
import FileModel from './file.model'
import UserModel from '../users/user.model'

export default {
  findFiles: async ({userId, group}) => {
    const whereCondition = {}

    if(group) {
      whereCondition.where = {group}
    }

    return FileModel.findAll({
      ...whereCondition,
      include: [
        {model: UserModel, where: {id: userId}, attributes: [], required: true}
      ]
    })
  },

  upload: async (data, {userId, companyId}) => {
    const result = await mysql.transaction(async transaction => {
      const file = await FileModel.create({...data.file, companyId, group: data.group}, {returning: true, transaction})
      await file.setUsers([userId], {transaction})
      return file
    })

    return  result 
  }
}
