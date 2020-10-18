import {WORKING_HOURS_SLOTS} from '../constants/times'

export function getHoursSlots (appointments) {
  const slots = {...WORKING_HOURS_SLOTS}

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