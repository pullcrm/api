import dayjs from 'dayjs'

import {setTime} from '../../utils/time'

export function creationNotifyMessage (payload, template) {
  const {procedures, date, startTime, specialist} = payload

  const proceduresText = procedures.map(({name}) => name).join(', ')

  if(template) {
    return template.toString()
      .replace('%specialist%', specialist.user.firstName)
      .replace('%date%', dayjs(date).format('DD.MM'))
      .replace('%time%', startTime.slice(0, 5))
      .replace('%procedures%', proceduresText)
  }
  
  return `Новая запись! ${dayjs(date).format('DD.MM')} в ${startTime.slice(0, 5)} ${proceduresText}. Сотрудник ${specialist.user.firstName}`
}
  
export function remindNotifyMessage ({procedures, date, startTime, specialist}, template) {
  const proceduresText = procedures.map(({name}) => name).join(', ')

  if(template) {
    return template.toString()
      .replace('%specialist%', specialist?.user?.firstName)
      .replace('%date%', dayjs(date).format('DD.MM'))
      .replace('%time%', startTime.slice(0, 5))
      .replace('%procedures%', proceduresText)
  }
  
  return `Напоминание о записи! ${dayjs(date).format('DD.MM')} в ${startTime.slice(0, 5)} у вас ${proceduresText}`
}

export function isTimeExpired (dateTime) {
  // dateTime as dayjs
  return dateTime.diff(new Date()) < 0
}

export function isAppointmentEdited (oldAppointment, newAppointment) {
  const newDateTime = setTime(newAppointment.date, newAppointment.startTime).format('DD.MM.YY HH:mm')
  const oldDateTime = !oldAppointment.isQueue && setTime(oldAppointment.date, oldAppointment.startTime).format('DD.MM.YY HH:mm')

  return (
    newDateTime !== oldDateTime ||
    newAppointment.hasRemindSMS !== Boolean(oldAppointment.smsIdentifier)
  )
}
