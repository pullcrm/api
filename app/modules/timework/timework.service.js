import {isEmpty} from 'lodash'
import {Op} from 'sequelize'
import ApiException from '../../exceptions/api'
import { addDayToDate } from '../../utils/time'
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

  checkIfExist: async ({timeWork, specialistId}) => {
    //TODO: NEED TO FINISH
    const specialistTimeWork = await SpecialistTimeWorkModel.findAll({
      where: {
        specialistId,
        [Op.or]: [
          {
            startDateTime: {
              [Op.gt]: timeWork.map(T => T.startDateTime),
              [Op.lt]: timeWork.map(T => T.endDateTime),
            },
          },
          {
            endDateTime: {
              [Op.gt]: timeWork.map(T => T.startDateTime),
              [Op.lt]: timeWork.map(T => T.endDateTime),
            },
          },
        ],
      },
      raw: true,
    })

    console.log(specialistTimeWork)

    if (!isEmpty(specialistTimeWork)) {
      throw new ApiException(400, "The time for this day is already set")
    }

    return specialistTimeWork
  },

  bulkSpecialistTimeWorkCreate: async ({timeWork, specialistId}) => {
    return SpecialistTimeWorkModel.bulkCreate(timeWork.map(T => ({...T, specialistId})))
  },

  specialistTimeWorkUpdate: async (data, {timeWorkId}) => {
    const specilistWorkTime = await SpecialistTimeWorkModel.findOne({where: {id: timeWorkId}})
    return specilistWorkTime.update(data) 
  },

  specialistTimeWorkDestroy: async ({timeWorkId}) => {
    const specilistWorkTime = await SpecialistTimeWorkModel.findOne({where: {id: timeWorkId}})
    return specilistWorkTime.destroy({cascade: true})
  },

  getSpecialistTimeWork: async ({specialistId, startDate}) => {
    const where = {specialistId}
    const endDate = addDayToDate(startDate)

    if(startDate) {
      where[Op.or] = [
        {
          startDateTime: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          endDateTime: {
            [Op.between]: [startDate, endDate],
          },
        },
      ]
    }
  
    return SpecialistTimeWorkModel.findAll({where})
  }
}
