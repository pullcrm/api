import { decrypt } from "./crypto"

export default smsToken => {
  const data = JSON.parse(Buffer.from(smsToken, 'hex'))

  return {...data, privateKey: decrypt(data.privateKey)}
}