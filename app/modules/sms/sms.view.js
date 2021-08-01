import dayjs from 'dayjs'

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
  
  return `Новая запись! ${dayjs(date).format('DD.MM')} в ${startTime.slice(0, 5)} ${proceduresText}. Сотрудник ${specialist.user.fullName}`
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
  
  return `Напоминание о записи! ${dayjs(date).format('DD.MM')} в ${startTime.slice(0, 5)} у вас ${proceduresText}`
}

export function isTimeExpired ({date, startTime}) {
  const dateTime = setTime(date, startTime)

  if (dateTime.diff(new Date()) < 0) {
    return true
  }

  return false
}
