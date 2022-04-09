
export const addUAFormat = phone => {
  if(phone.startsWith('38')) {
    return phone
  }

  return `38${phone}`
}

export const removeUAFormat = phone => {
  if(phone.startsWith('0')) {
    return phone
  }

  return phone.substring(phone.indexOf("0"))
}