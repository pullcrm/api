import {Telegraf} from 'telegraf'
import UserService from '../../modules/users/user.service'
import { removeUAFormat } from '../../utils/phone'

const TelegramBot = new Telegraf(process.env.TELEGRAM_TOKEN)

TelegramBot.start(ctx => {
  console.log(ctx.chat.id)
  TelegramBot.telegram.sendMessage(ctx.chat.id, 'Нажмите на кнопку ниже!', requestPhoneKeyboard)
})
  
TelegramBot.on('contact', async ctx => {
  // const chatId = msg.chat.id
  
  /**reply_markup
     * chatId: 289974583
     * 
      contact: {
        phone_number: '380660646333',
        first_name: 'Bohdan',
        last_name: 'Tsaryk',
        user_id: 289974583
      }
     */
  const phone = removeUAFormat(ctx.message.contact.phone_number)
  console.log(phone)
  const user = await UserService.findOneByPhone({phone})

  if(!user || user.telegramId) {
    ctx.reply('Пользователь не найден, убедитесь что такой пользователь зарегистрирован на pullcrm')
    return
  }

  const updateUser = await user.update({telegramId: ctx.message.contact.user_id})
  console.log(updateUser)
  ctx.reply('Теперь вы будете получать уведомления по указаному номеру.')
  
  // setInterval(() => bot.telegram.sendMessage(289974583, 'Повтор сообщений'), 3000)
  
})
  
// bot.stop(ctx => {
//   console.log(ctx)
//   console.log(ctx.chat.id)
//   console.log('stoped')
// })
  
const requestPhoneKeyboard = {
  "reply_markup": {
    "one_time_keyboard": true,
    "keyboard": [
      [{
        text: "Отправить номер телефона",
        request_contact: true,
        one_time_keyboard: true
      }]
    ]
  }
}
  
// Enable graceful stop
process.once('SIGINT', () => TelegramBot.stop('SIGINT'))
process.once('SIGTERM', () => TelegramBot.stop('SIGTERM'))
  
export default TelegramBot