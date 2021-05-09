import ProcedureModel from './models/procedure'
import ApiException from "../../exceptions/api"
import CategoryModel from '../categories/category.model'
import {PROCEDURE} from '../../constants/categories'

export default {
  findAll: async ({companyId, limit, offset}) => {
    const proceduresWithCategory = await CategoryModel.findAll({
      where: {companyId, type: PROCEDURE},
      limit, offset,
      attributes: {exclude: ['companyId']},
      include: {
        model: ProcedureModel,
        required: false
      }})

    const proceduresWithoutCategory = await ProcedureModel.findAll({
      where: {companyId, categoryId: null},
      attributes: {exclude: ['categoryId', 'companyId']},
    })

    return [...proceduresWithCategory, {
      name: 'Остальные',
      procedures: proceduresWithoutCategory
    }]
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
