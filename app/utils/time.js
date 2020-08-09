export const formatDate = date => new Date(date)

export const addDayToDate = date => {
  const currentDate = formatDate(date)
  return new Date(currentDate.setDate(currentDate.getDate() + 1)) 
}