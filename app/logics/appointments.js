import dayjs from "dayjs"
import difference from 'lodash/difference'

import {getWorkingHours} from '../utils/time'

// TODO: Refactor
export function getAvailableTime (payload) {
  const {
    from,
    to,
    duration,
    timeOffs,
    appointments
  } = payload

  const workingHours = getWorkingHours(from, to)

  return difference(
    workingHours,
    [
      ...getTimeOffsHours(timeOffs),
      ...getAppointmentsHours(appointments)
    ]
  )
    .filter((time, index, arr) => {
      const length = (duration / 15) - 1

      const indexEndTime = workingHours.indexOf(time) + length

      if (!arr[index + length]) return false

      return workingHours[indexEndTime] === arr[index + length]
    })
}

function getHoursFromInterval (from, to) {
  const hours = []

  const minutes = (new Date(to) - new Date(from)) / (60 * 1000)

  for (let index = 0; index < minutes / 15; index++) {
    hours.push(dayjs(from).add(15 * index, 'minute').format('HH:mm'))
  }

  return hours
}

function getTimeOffsHours (timeOffs) {
  return timeOffs.reduce((acc, item) => {
    return [
      ...acc,
      ...getHoursFromInterval(
        item.startDateTime,
        item.endDateTime
      )
    ]
  }, [])
}

function getAppointmentsHours (appointments) {
  return appointments.reduce((acc, {startTime, procedures}) => {
    const [hour, minute] = startTime.split(':')

    const duration = procedures.reduce((result, procedure) => {
      return result + procedure.duration
    }, 0)

    const date = dayjs().set('hour', hour).set('minute', minute).set('second', 0)

    return [
      ...acc,
      ...getHoursFromInterval(
        date.toDate(),
        date.add(duration, 'minute').toDate()
      )
    ]
  }, [])
}