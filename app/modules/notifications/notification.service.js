import dayjs from "dayjs"
import TelegramBot from "../../providers/telegram"
import AppointmentService from "../appointments/appointment.service"
import {isAppointmentEdited} from "../sms/sms.view"
import SpecialistService from "../specialists/specialist.service"

export default {
  createAppointment: async ({specialistId, startTime, date, appointmentId}) => {
    try {
      const appointment = await AppointmentService.find(appointmentId)
      const user = await SpecialistService.getUserBySpecialistId({specialistId: specialistId})

      if(user && user.telegramId) {
        const proceduresText = appointment.procedures.map(({name}) => name).join(', ')
  
        await TelegramBot.telegram.sendMessage(
          user.telegramId,
          `
          ✅ Новий запис! ${dayjs(date).format('DD.MM')} в ${startTime.slice(0, 5)} ${proceduresText}.`
        )
      }
    } catch(err) {
      console.log(err)
    }
  },

  updateAppointment: async (appointment, appointmentId) => {
    try {
      const oldAppointment = await AppointmentService.find(appointmentId)
      const user = await SpecialistService.getUserBySpecialistId({specialistId: appointment.specialistId})
      
      if (!appointment.startTime || !isAppointmentEdited(oldAppointment, appointment)) {
        return
      }

      if(user && user.telegramId) {
        const proceduresText = appointment.procedures.map(({name}) => name).join(', ')
  
        await TelegramBot.telegram.sendMessage(
          user.telegramId,
          `✍ Запис #${appointmentId} оновлено! ${dayjs(appointment.date).format('DD.MM')} в ${appointment.startTime.slice(0, 5)} ${proceduresText}.`
        )
      }
    } catch(err) {
      console.log(err)
    }
  },

  deleteAppointment: async appointmentId => {
    try {
      const appointment = await AppointmentService.find(appointmentId)

      if(!appointment) {
        return
      }

      const user = await SpecialistService.getUserBySpecialistId({specialistId: appointment.specialistId})

      if(user && user.telegramId) {
        const proceduresText = appointment.procedures.map(({name}) => name).join(', ')
  
        await TelegramBot.telegram.sendMessage(
          user.telegramId,
          `
          🚫 Запис #${appointmentId} видалено! ${dayjs(appointment.date).format('DD.MM')} в ${appointment.startTime.slice(0, 5)} ${proceduresText}.`
        )
      }
    } catch(err) {
      console.log(err)
    }
  },
}
