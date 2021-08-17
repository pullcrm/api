const SMSAPI = require("e-pochta-sms-api").SMSAPI
const Stat = require("e-pochta-sms-api").Stat

export default keys => {
  const gateway = new SMSAPI({
    ...keys,
    url: "http://api.myatompark.com/sms/3.0/"
  })

  console.log(new Stat(gateway))

  return new Stat(gateway)
}