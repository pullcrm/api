import dayjs from 'dayjs'
import {IN_QUEUE} from '../../constants/appointments'

import {setTime} from '../../utils/time'

export function creationNotifyMessage (payload, template) {
  const {procedures, date, startTime, specialist} = payload

  const proceduresText = procedures.map(({name}) => name).join(', ')

  if(template) {
    return template.toString()
      .replace('%specialist%', specialist.user.fullName)
      .replace('%date%', dayjs(date).format('DD.MM'))
      .replace('%time%', startTime.slice(0, 5))
      .replace('%procedures%', proceduresText)
  }
  
  return `Новий запис! ${dayjs(date).format('DD.MM')} в ${startTime.slice(0, 5)} ${proceduresText}. Працівник ${specialist.user.fullName}`
}
  
export function remindNotifyMessage ({procedures, date, startTime, specialist}, template) {
  const proceduresText = procedures.map(({name}) => name).join(', ')

  if(template) {
    return template.toString()
      .replace('%specialist%', specialist?.user?.fullName)
      .replace('%date%', dayjs(date).format('DD.MM'))
      .replace('%time%', startTime.slice(0, 5))
      .replace('%procedures%', proceduresText)
  }
  
  return `Нагадування про запис! ${dayjs(date).format('DD.MM')} в ${startTime.slice(0, 5)} у вас ${proceduresText}`
}

export function isTimeExpired (dateTime) {
  // dateTime as dayjs
  return dateTime.diff(new Date()) < 0
}

export function isAppointmentEdited (oldAppointment, newAppointment) {
  const newDateTime = setTime(newAppointment.date, newAppointment.startTime).format('DD.MM.YY HH:mm')
  const oldDateTime = oldAppointment.status !== IN_QUEUE && setTime(oldAppointment.date, oldAppointment.startTime).format('DD.MM.YY HH:mm')
  console.log(newDateTime, oldDateTime)

  return (newDateTime !== oldDateTime)
}
