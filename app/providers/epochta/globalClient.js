import epocthaAPI from 'epochta-client-pullcrm'

const SMS_PUBLIC_KEY = process.env.SMS_PUBLIC_KEY
const SMS_PRIVATE_KEY = process.env.SMS_PRIVATE_KEY

const keys = {
  publicKey: SMS_PUBLIC_KEY,
  privateKey: SMS_PRIVATE_KEY,
}

console.log('KEYS', keys)

const client = epocthaAPI(keys)

export default client