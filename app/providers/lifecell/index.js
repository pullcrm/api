import fetch, {Headers} from 'node-fetch'
import {addUAFormat} from '../../utils/phone'

const url = "https://api.omnicell.com.ua/ip2sms/"
const authToken = Buffer.from(`${process.env.LIFECELL_LOGIN}:${process.env.LIFECELL_PASSWORD}`).toString('base64')

export default {
  async sendOneSMS({message, phone, alphaName = 'TECT'}) {
    const template = {
      id: "single",
      source: alphaName,
      extended: true,
      type: "SMS",
      to: [
        {
          "msisdn": addUAFormat(phone)
        }
      ],
      body: {
        "value": message
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(template),
      headers: new Headers({
        'Authorization': `Basic ${authToken}`, 
        'Content-Type': 'application/json'
      }), 
    }).catch(error => console.warn(error))

    const json = await response.json()
    // const json = {"state":{"value":"Accepted"},"id":6616738538164,"date":"Sat, 09 Apr 2022 10:35:28 +0300","execTime":3}
    return json
  }
}