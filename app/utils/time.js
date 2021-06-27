import dayjs from "dayjs"

export const formatDate = date => new Date(date)

export const addDayToDate = date => {
  const currentDate = formatDate(date)

  return new Date(currentDate.setDate(currentDate.getDate() + 1)) 
}

export function setTime (date, time) {
  const [hour, minute] = time.split(':')

  return dayjs(date).hour(Number(hour)).minute(Number(minute)).second(0)
}

export function getWorkingHours (open, close) {
  const hours = []

  let from = setTime(new Date(), open)

  do {
    hours.push(from.format('HH:mm'))

    from = from.add(15, 'm')
  } while (from.format('HH:mm') !== close)

  return hours
}

export function getDayWorkTime (date, timeWork) {
  const day = dayjs(date).format('dddd').toLowerCase()
  const [opened, from, to] = timeWork[day].split(';')

  return {
    opened: opened === 'true',
    from,
    to
  }
}