import ProcedureModel from './procedure.model'

export default {
  findAll: async () => {
    return ProcedureModel.findAll()
  },

  createMany: async data => {
    return ProcedureModel.bulkCreate(data)
  }
}
