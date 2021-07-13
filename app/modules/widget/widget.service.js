import WidgeSettingstModel from './models/settings.model'

export default {
  update: async (data, {companyId}) => {
    const widgetSettings = await WidgeSettingstModel.findOne({where: {companyId}})
    return widgetSettings.update(data)
  },

  findOne: async ({companyId}) => {
    const settings = await WidgeSettingstModel.findOne({
      where: {companyId},
      attributes: {exclude: ['id', 'companyId', 'createdAt', 'updatedAt']}
    })

    return settings
  },
}
