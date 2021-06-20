import TimeWorkModel from './timework.model'

export default {
  update: async (data, {companyId}) => {
    return TimeWorkModel
      .findOne({where: {companyId}})
      .then(workTime => workTime
        ? workTime.update(data)
        : TimeWorkModel.create({...data, companyId}))
  },

  findOne: async ({companyId}) => {
    const timeWork = await TimeWorkModel.findOne({
      where: {companyId},
      attributes: {exclude: ['id', 'companyId', 'createdAt', 'updatedAt']}
    })

    return timeWork
  },
}
