
export const addUAFormat = phone => {
  if(phone.startsWith('+38')) {
    return phone
  }

  return `+38${phone}`
}