import ProcedureModel from './procedure.model'
import ApiException from "../../exceptions/api";

export default {
  findAll: async ({companyId, limit, offset}) => {
    return ProcedureModel.findAll({where: {id: companyId}, limit, offset}, {raw: true})
  },

  create: async data => {
    return ProcedureModel.create(data)
  },

  update: async (data, {procedureId, companyId}) => {
    const procedure = await ProcedureModel.findOne({where: {id: procedureId}})

    if(!procedure) {
      throw new ApiException(404, 'Procedure wasn\'t found')
    }

    if(procedure.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your procedure')
    }

    return procedure.update(data, {plain: true})
  },

  destroy: async ({procedureId, companyId}) => {
    const procedure = await ProcedureModel.findOne({where: {id: procedureId}})

    if(!procedure) {
      throw new ApiException(404, 'Procedure wasn\'t found')
    }

    if(procedure.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your procedure')
    }

    await procedure.destroy()
    return {destroy: 'OK'}
  },
}
