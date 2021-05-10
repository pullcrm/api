import ProcedureModel from './models/procedure'
import ApiException from "../../exceptions/api"
import CategoryModel from '../categories/category.model'

export default {
  findAll: async ({companyId, limit, offset}) => {
    const procedures = await ProcedureModel.findAll({
      where: {companyId},
      limit, offset,
      include: {
        model: CategoryModel,
      },
      attributes: {exclude: ['categoryId', 'companyId']},
    })

    return procedures
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
