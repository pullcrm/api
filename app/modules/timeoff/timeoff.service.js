import {Op} from 'sequelize'
import TimeOffModel from './timeoff.model'
import ApiException from "../../exceptions/api"
import {addDayToDate} from '../../utils/time'

export default {
  create: async data => {
    return await TimeOffModel.create(data, {returning: true})
  },

  update: async (data, {timeOffId}) => {
    const timeOff = await TimeOffModel.findOne({where: {id: timeOffId}})

    if(!timeOff) {
      throw new ApiException(404, 'Time wasn\'t found')
    }

    return timeOff.update(data, {returning: true})
  },

  findAll: async ({employeeId, date}) => {
    const endDate = addDayToDate(date)
  
    const where = {
      [Op.or]: [
        {
          startDateTime: {
            [Op.between]: [date, endDate]
          }
        },
        {
          endDateTime: {
            [Op.between]: [date, endDate]
          }
        }
      ]
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    const timeOff = await TimeOffModel.findAll({where})

    return timeOff
  },

  checkTime: async appointment => {
    const times = await TimeOffModel.findAll({where: {employeeId: appointment.employeeId,
      date: {
        [Op.gt]: appointment.date,
        [Op.lt]: addDayToDate(appointment.date)
      }
    }, raw: true})

    // const apStartTime = appointment.startTime
    // const totalDuration = appointment.procedures.reduce((result, procedure) => {
    //   return result + procedure.duration
    // }, 0)
    // const apEndTime = 
    
    // times.map(
    //   T => {
    //     const startTime = T.startTime
    //     const endTime = T.endTime
    //     const currentDate = new Date()   

    //     let startDate = new Date(currentDate.getTime())
    //     startDate.setHours(startTime.split(":")[0])
    //     startDate.setMinutes(startTime.split(":")[1])
    //     startDate.setSeconds(startTime.split(":")[2])

    //     let endDate = new Date(currentDate.getTime())
    //     endDate.setHours(endTime.split(":")[0])
    //     endDate.setMinutes(endTime.split(":")[1])
    //     endDate.setSeconds(endTime.split(":")[2])

    //     valid = startDate < appointment.startTime && endDate > appointment.endTime

    //     console.log(Date(T.startTime) > Date(appointment.startTime))
    //   }
    // )

    // console.log(times)
  
    return times
  },

  destroy: async ({timeOffId}) => {
    const timeOff = await TimeOffModel.findOne({where: {id: timeOffId}})

    if(!timeOff) {
      throw new ApiException(404, 'TimeOff wasn\'t found')
    }

    await timeOff.destroy()
    return {destroy: 'OK'}
  },
}
