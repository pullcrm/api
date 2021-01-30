import { decrypt } from "./crypto"

export default smsToken => {
  const data = JSON.parse(Buffer.from(smsToken, 'hex'))

  return {...data, password: decrypt(data.password)}
}