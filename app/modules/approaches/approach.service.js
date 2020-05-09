import ApproachModel from './approach.model'

export default {
  findAll: async ({companyId}) => {
    return ApproachModel.findAll({companyId})
  },

  create: async data => {
    return ApproachModel.create(data)
  },

  hasRow: async data => {
    const raw = await ApproachModel.findOne({where: data, raw: true})
    return Boolean(raw)
  }
}
