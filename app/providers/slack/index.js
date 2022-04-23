import fetch, {Headers} from 'node-fetch'

const api = "https://slack.com/api"
const authToken = process.env.SLACK_TOKEN

export default {
  async postMessage({blocks, channel = '#support'}) {
    const template = {
      channel,
      blocks
    }

    const response = await fetch(`${api}/chat.postMessage`, {
      method: 'POST',
      body: JSON.stringify(template),
      headers: new Headers({
        'Authorization': `Bearer ${authToken}`, 
        'Content-Type': 'application/json'
      }), 
    }).catch(error => console.warn(error))

    const json = await response.json()

    return json
  },

  async getIcons() {
    const response = await fetch(`${api}/emoji.list`, {
      headers: new Headers({
        'Authorization': `Bearer ${authToken}`, 
        'Content-Type': 'application/json'
      })
    })

    const json = await response.json()
    return json
  }
}