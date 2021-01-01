import bcrypt from 'bcrypt'

export const encryptPassword = password =>  bcrypt.hashSync(password, 10)