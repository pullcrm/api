import dayjs from 'dayjs'

import {setTime} from '../../utils/time'

export function creationNotifyMessage (payload) {
  const {procedures, date, startTime, employee} = payload

  const proceduresText = procedures.map(({name}) => name).join(', ')
  
  return `Новая запись! ${dayjs(date).format('DD.MM')} в ${startTime.slice(0, 5)} ${proceduresText}. Сотрудник ${employee.firstName}`
}
  
export function remindNotifyMessage ({procedures, date, startTime}) {
  const proceduresText = procedures.map(({name}) => name).join(', ')
  
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
    newAppointment.smsRemindNotify !== Boolean(oldAppointment.smsIdentifier)
  )
}
