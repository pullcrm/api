import TimeWorkModel from './timework.model'

export default {
  update: async (data, {companyId}) => {
    const workTime = await TimeWorkModel.findOne({where: {companyId}})
    return workTime.update(data) 
  },

  findOne: async ({companyId}) => {
    const timeWork = await TimeWorkModel.findOne({
      where: {companyId},
      attributes: {exclude: ['id', 'companyId', 'createdAt', 'updatedAt']}
    })

    return timeWork
  },
}
