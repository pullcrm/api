import Slack from '../../providers/slack'

export default {
  sendMessage: async ({comment, email, phone, name}) => {
    const icons = [":unicorn_face:", ":beer:", ":bee:", ":man_dancing:",
      ":party_parrot:", ":ghost:", ":dancer:", ":scream_cat:"]
  
    const item = icons[Math.floor(Math.random() * icons.length)]

    return Slack.postMessage({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${item} *${name}*`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `> ${comment} `
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${email} ${phone}`
          }
        },
        {
          "type": "divider"
        },
      ]
    }
    )
  }
}
