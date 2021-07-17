import epocthaAPI from 'epochta-client'

const SMS_PUBLIC_KEY = process.env.SMS_PUBLIC_KEY
const SMS_PRIVATE_KEY = process.env.SMS_PRIVATE_KEY

const keys = {
  publicKey: SMS_PUBLIC_KEY,
  privateKey: SMS_PRIVATE_KEY,
}

const client = epocthaAPI(keys)

// client.registerSenderName({
//   name: 'PullCRM',
//   description: 'ua',
//   siteUrl: 'pullcrm.com',
//   country: 'UA'
// })

export default client