import {Op, QueryTypes} from "sequelize"
import dayjs from "dayjs"
import isEmpty from "lodash/isEmpty"
import TimeOffModel from "./timeoff.model"
import ApiException from "../../exceptions/api"
import {addDayToDate} from "../../utils/time"
import ProcedureModel from "../procedures/models/procedure"
import {mysql} from "../../config/connections"

export default {
  create: async data => {
    return await TimeOffModel.create(data, {returning: true})
  },

  update: async (data, {timeOffId}) => {
    const timeOff = await TimeOffModel.findOne({where: {id: timeOffId}})

    if (!timeOff) {
      throw new ApiException(404, "Time wasn't found")
    }

    return timeOff.update(data, {returning: true})
  },

  findAll: async ({specialistId, date}) => {
    const endDate = addDayToDate(date)

    const where = {
      [Op.or]: [
        {
          startDateTime: {
            [Op.between]: [date, endDate],
          },
        },
        {
          endDateTime: {
            [Op.between]: [date, endDate],
          },
        },
      ],
    }

    if (specialistId) {
      where.specialistId = specialistId
    }

    const timeOff = await TimeOffModel.findAll({where})

    return timeOff
  },

  checkForAvailableTime: async appointment => {
    const procedures = await ProcedureModel.findAll({
      where: {id: appointment.procedures},
    })

    const duration = procedures.reduce((result, procedure) => {
      return result + procedure.duration
    }, 0)

    const endTime = dayjs(appointment.startTime, "HH:mm:ss")
      .add(duration, "minutes")
      .format("HH:mm:ss")

    const oldAppointment = await mysql.query(`
      select
        ap.id, ap.date, ap.startTime, pr.duration
      from appointments as ap
      left join appointment_procedures as app on ap.id = app.appointmentId
      left join procedures as pr on app.procedureId = pr.id
      where (ap.date = '${appointment.date}') and (
        ap.startTime >= '${appointment.startTime}' and ap.startTime <= '${endTime}' or
        (ap.startTime + interval pr.duration minute) > '${appointment.startTime}' and
        (ap.startTime + interval pr.duration minute) < '${endTime}')
    `, {type: QueryTypes.SELECT})

    if (!isEmpty(oldAppointment)) {
      throw new ApiException(400, "There is an appointment for this time")
    }

    const startTimeOff = `${appointment.date} ${appointment.startTime}`
    const endTimeOff = `${appointment.date} ${endTime}`

    const timeOffs = await TimeOffModel.findAll({
      where: {
        specialistId: appointment.specialistId,
        [Op.or]: [
          {
            startDateTime: {
              [Op.gt]: startTimeOff,
              [Op.lt]: endTimeOff,
            },
          },
          {
            endDateTime: {
              [Op.gt]: startTimeOff,
              [Op.lt]: endTimeOff,
            },
          },
        ],
      },
      raw: true,
    })

    if (!isEmpty(timeOffs)) {
      throw new ApiException(400, "Specialist is on break for this time")
    }

    return timeOffs
  },

  destroy: async ({timeOffId}) => {
    const timeOff = await TimeOffModel.findOne({where: {id: timeOffId}})

    if (!timeOff) {
      throw new ApiException(404, "TimeOff wasn't found")
    }

    await timeOff.destroy()
    return {destroy: "OK"}
  },
}
