import WidgeSettingstModel from './models/settings.model'

export default {
  update: async (data, {companyId}) => {
    return WidgeSettingstModel
      .findOne({where: {companyId}})
      .then(workTime => workTime
        ? workTime.update(data)
        : WidgeSettingstModel.create({...data, companyId}))
  },
  findOne: async ({companyId}) => {
    const settings = await WidgeSettingstModel.findOne({
      where: {companyId},
      attributes: {exclude: ['id', 'companyId', 'createdAt', 'updatedAt']}
    })

    return settings
  },
}
