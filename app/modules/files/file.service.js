import fs from 'fs'
import {promisify} from 'util'
import {mysql} from '../../config/connections'
import FileModel from './file.model'
import UserModel from '../users/user.model'
import ApiException from '../../exceptions/api'

const unlinkAsync = promisify(fs.rmdir)

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
  },

  //TODO add condition who can delete the file
  destroy: async ({fileId}) => {
    const file = await FileModel.findOne({where: {id: fileId}})

    if(!file) {
      throw new ApiException(404, 'File wasn\'t found')
    }

    await file.destroy({cascade: true})
    await unlinkAsync('uploads/' + file.getDataValue('path')?.split('/')[1], {recursive: true})
    return {destroy: 'OK'}
  },
}
