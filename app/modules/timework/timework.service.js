import TimeWorkModel from './models/companyTimework'
import SpecialistTimeWorkModel from './models/specialistTimework'

export default {
  update: async (data, {companyId}) => {
    const workTime = await TimeWorkModel.findOne({where: {companyId}})
    return workTime.update(data) 
  },

  findOne: async ({companyId}) => {
    const timeWork = await TimeWorkModel.findOne({
      where: {companyId},
      attributes: {exclude: ['id', 'companyId', 'createdAt', 'updatedAt']}
    })

    return timeWork
  },

  bulkSpecialistTimeWorkCreate: async ({timeWork, specialistId}) => {
    return SpecialistTimeWorkModel.bulkCreate(timeWork.map(T => ({...T, specialistId})))
  },

  getSpecialistTimeWork: async ({specialistId}) => {
    return SpecialistTimeWorkModel.findAll({where: {specialistId}})
  }
}
