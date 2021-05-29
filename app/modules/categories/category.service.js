import ApiException from '../../exceptions/api'
import CategoryModel from './category.model'

export default {
  create: async data => {
    return CategoryModel.create(data)
  },

  find: async ({companyId, limit, offset, type}) => {
    return CategoryModel.findAll({where: {companyId, type}, limit, offset, attributes: {exclude: ['companyId']}})
  },

  update: async (data, {categoryId, companyId}) => {
    const category = await CategoryModel.findOne({where: {id: categoryId}})

    if(!category) {
      throw new ApiException(404, 'Category wasn\'t found')
    }

    if(category.get('companyId') !== companyId) {
      throw new ApiException(403, 'That is not your category')
    }

    return category.update(data, {plain: true})
  },

  destroy: async ({categoryId, companyId}) => {
    const category = await CategoryModel.findOne({where: {id: categoryId}})

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
