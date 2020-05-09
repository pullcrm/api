import CategoryModel from './category.model'

export default {
  findAll: async () => {
    return CategoryModel.findAll()
  },

  create: async data => {
    return CategoryModel.create(data)
  }
}
