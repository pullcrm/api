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
            "text": "Привіт :wave:"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Надійшов новий лист в підтримку від ${item} *${name}*`
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
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${email}* \n *${phone}*`
          },
          "accessory": {
            "type": "button",
            "style": "primary",
            "text": {
              "type": "plain_text",
              "text": "Відповісти",
              "emoji": true
            },
            "value": "click_me_123",
            "url": `mailto:${email}`,
            "action_id": "button-action"
          }
        }
      ]
    }
    )
  }
}
