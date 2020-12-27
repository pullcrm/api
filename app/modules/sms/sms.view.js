import dayjs from 'dayjs'

export function creationNotifyMessage (payload) {
  const {procedures, date, startTime, employee} = payload
  const proceduresText = procedures.map(({name}) => name).join(', ')
  const parsedDate = dayjs(date)
  
  return `Новая запись! ${proceduresText} на ${parsedDate.format('DD.MM')} в ${startTime.slice(0, 5)}. Сотрудник ${employee.firstName}`
}
  
export function remindNotifyMessage ({procedures}, minutes) {
  const proceduresText = procedures.map(({name}) => name).join(', ')
  
  return `Через ${getDurationName(minutes)} у вас ${proceduresText}`
}

export const durations = getDurations()

export function getDurationName (time) {
  return durations.find(item => item.value === time)?.name
}

function getDurations () {
  const list = []

  let hour = 0
  let minute = 0

  while (hour < 4) {
    const time = []

    minute += 15

    if (minute === 60) {
      hour++
      minute = 0
    }

    if (hour > 0) {
      time.push(`${hour} ${pluralize(hour, 'час', 'часа', 'часов')}`)
    }

    if (minute > 0) {
      time.push(`${minute} минут`)
    }

    list.push({
      name: time.join(' '),
      value: hour * 60 + minute
    })
  }

  return list
}

export function pluralize (number, one, two, five) {
  number = Math.abs(number)
  number %= 100

  if (number >= 5 && number <= 20) {
    return five
  }

  number %= 10

  if (number === 1) {
    return one
  }

  if (number >= 2 && number <= 4) {
    return two
  }

  return five
}