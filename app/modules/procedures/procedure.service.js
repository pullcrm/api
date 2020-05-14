import ProcedureModel from './procedure.model'

export default {
  findAll: async ({companyId, limit, offset}) => {
    return ProcedureModel.findAll({where: {id: companyId}, limit, offset}, {raw: true})
  },

  createMany: async data => {
    return ProcedureModel.bulkCreate(data)
  }
}
