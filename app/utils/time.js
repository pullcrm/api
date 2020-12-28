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