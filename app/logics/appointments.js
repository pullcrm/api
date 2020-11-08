import {WORKING_HOURS_SLOTS, WORKING_HOURS} from '../constants/times'

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
export function getHoursSlots (payload) {
  const {
    timeOffs,
    appointments
  } = payload

  const slots = {...WORKING_HOURS_SLOTS}

  timeOffs.forEach(timeOff => {
    const startTime = getTime(timeOff.startDateTime)
    const endTime = getTime(timeOff.endDateTime)

    const indexStartTime = WORKING_HOURS.indexOf(startTime)
    const indexEndTime = WORKING_HOURS.indexOf(endTime) + 1

    const closeTimes = WORKING_HOURS.slice(indexStartTime, indexEndTime)

    closeTimes.forEach(time => {
      slots[time] = true
    })
  })

  appointments.forEach(({startTime, procedures}) => {
    const duration = procedures.reduce((result, procedure) => {
      return result + procedure.duration
    }, 0)

    const slotCount = duration / 15
    const startIndex = Object.keys(slots).indexOf(startTime.slice(0, 5))
    
    for (let index = 0; index < slotCount; index++) {
      const key = Object.keys(slots)[startIndex + index]

      slots[key] = true
    }
  })

  return slots
}