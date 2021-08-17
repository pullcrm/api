const SMSAPI = require("epochta-pullcrm").SMSAPI
const Stat = require("epochta-pullcrm").Stat

export default keys => {
  const gateway = new SMSAPI({
    ...keys,
    url: "http://api.myatompark.com/sms/3.0/"
  })

  console.log(new Stat(gateway))

  return new Stat(gateway)
}