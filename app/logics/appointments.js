import difference from 'lodash/difference'

import {WORKING_HOURS} from '../constants/times'

// TODO: Refactor
function getTime (date) {
  date = new Date(date)

  let minutes = date.getMinutes()

  if (minutes === 0) {
    minutes = '00'
  }

  return `${date.getHours()}:${minutes}`
}

// TODO: Refactor
export function getAvailableTime (payload) {
  const {
    duration,
    timeOffs,
    appointments
  } = payload

  let closedTimes = []

  timeOffs.forEach(timeOff => {
    const startTime = getTime(timeOff.startDateTime)
    const endTime = getTime(timeOff.endDateTime)

    const indexStartTime = WORKING_HOURS.indexOf(startTime)
    const indexEndTime = WORKING_HOURS.indexOf(endTime) + 1

    closedTimes = [...closedTimes, ...WORKING_HOURS.slice(indexStartTime, indexEndTime)]
  })

  appointments.forEach(({startTime, procedures}) => {
    const proceduresDuration = procedures.reduce((result, procedure) => {
      return result + procedure.duration
    }, 0)

    const timePoints = proceduresDuration / 15

    const indexStartTime = WORKING_HOURS.indexOf(startTime.slice(0, 5))
    const indexEndTime = indexStartTime + timePoints

    closedTimes = [...closedTimes, ...WORKING_HOURS.slice(indexStartTime, indexEndTime)]
  })

  const times = difference(WORKING_HOURS, [...new Set(closedTimes)]).filter((time, index, arr) => {
    const timePoints = (duration / 15) - 1

    const indexEndTime = WORKING_HOURS.indexOf(time) + timePoints

    if (!arr[index + timePoints]) return false

    return WORKING_HOURS[indexEndTime] === arr[index + timePoints]
  })

  return times
}