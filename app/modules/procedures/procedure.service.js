import ProcedureModel from './models/procedure'
import ApiException from "../../exceptions/api"
import CategoryModel from '../categories/category.model'
import {mysql} from '../../config/connections'

export default {
  findAll: async ({companyId, limit, offset, sort, order}) => {
    const procedures = await ProcedureModel.findAll({
      where: {companyId},
      limit, offset,
      order: [
        [sort, order],
        ['id', order]
      ],
      include: {
        model: CategoryModel,
      },
      attributes: {exclude: ['categoryId', 'companyId']},
    })

    return procedures
  },

  create: async data => {
    const result = await mysql.transaction(async transaction => {
      const procedure = await ProcedureModel.create(data, {transaction})

      if(data.specialistIds) {
        await procedure.setSpecialists(data.specialistIds, {transaction})
      }

      return procedure
    })

    return result
  },

  update: async (data, {procedureId, companyId}) => {
    const procedure = await ProcedureModel.findOne({where: {id: procedureId}})

    if(!procedure) {
      throw new ApiException(404, 'Procedure wasn\'t found')
    }

    if(procedure.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your procedure')
    }

    const result = await mysql.transaction(async transaction => {
      await procedure.update(data, {transaction})

      if(data.specialistIds && Array.isArray(data.specialistIds)) {
        await procedure.setSpecialists(data.specialistIds, {transaction})
      }

      return procedure
    })

    return result
  },

  bulkUpdate: async ({procedures}) => {
    return ProcedureModel.bulkCreate(procedures, {updateOnDuplicate: ['order']})
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
