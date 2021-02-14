import ProcedureModel from './models/procedure'
import ProcedureCategoriesModel from './models/category'
import ApiException from "../../exceptions/api"

export default {
  findAll: async ({companyId, limit, offset}) => {
    return ProcedureModel.findAll({where: {companyId}, limit, offset, attributes: {exclude: ['companyId']}}, {raw: true})
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

  createCategory: async data => {
    return ProcedureCategoriesModel.create(data)
  },

  findCategories: async ({companyId, limit, offset}) => {
    return ProcedureCategoriesModel.findAll({where: {companyId}, limit, offset, attributes: {exclude: ['companyId']}})
  },

  updateCategory: async (data, {categoryId, companyId}) => {
    const category = await ProcedureCategoriesModel.findOne({where: {id: categoryId}})

    if(!category) {
      throw new ApiException(404, 'Category wasn\'t found')
    }

    if(category.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your category')
    }

    return category.update(data, {plain: true})
  },

  destroyCategory: async ({categoryId, companyId}) => {
    const category = await ProcedureCategoriesModel.findOne({where: {id: categoryId}})

    if(!category) {
      throw new ApiException(404, 'Category wasn\'t found')
    }

    if(category.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your category')
    }

    await category.destroy()
    return {destroy: 'OK'}
  },
}
