import {mysql} from '../../config/connections'
import FileModel from './file.model'

export default {
  findMyFiles: async ({companyId, userId}) => {
    return FileModel.findAll({where: {companyId}})
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
