const SMSAPI = require("epochta-pullcrm").SMSAPI
const Stat = require("epochta-pullcrm").Stat

const SMS_PUBLIC_KEY = process.env.SMS_PUBLIC_KEY
const SMS_PRIVATE_KEY = process.env.SMS_PRIVATE_KEY

const gatewayOptions = {
  publicKey: SMS_PUBLIC_KEY,
  privateKey: SMS_PRIVATE_KEY,
  url: "http://api.myatompark.com/sms/3.0/"
}

const gateway = new SMSAPI(gatewayOptions)
const stat = new Stat(gateway)

export default stat