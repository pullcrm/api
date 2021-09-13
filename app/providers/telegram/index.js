import {Telegraf} from 'telegraf'
import UserService from '../../modules/users/user.service'
import {removeUAFormat} from '../../utils/phone'

const TelegramBot = new Telegraf(process.env.TELEGRAM_TOKEN)

TelegramBot.start(ctx => {
  // console.log(ctx.chat.id)
  TelegramBot.telegram.sendMessage(ctx.chat.id, 'Отправьте свой номер чтобы получать уведомления о записях!', requestPhoneKeyboard)
})
  
TelegramBot.on('contact', async ctx => {
  // const chatId = msg.chat.id
  
  /**
    chatId: 289974583

    contact: {
      phone_number: '380660646333',
      first_name: 'Bohdan',
      last_name: 'Tsaryk',
      user_id: 289974583
    }
  */

  const user = await UserService.findOneByPhone({
    phone: removeUAFormat(ctx.message.contact.phone_number)
  })

  if(!user) {
    // TODO: Can register a user here
    return ctx.reply('Пользователь не найден, убедитесь что такой пользователь зарегистрирован на pullcrm')
  }

  if (user.telegramId) {
    return ctx.reply('Вы уже получаете уведомления в этот чат.')
  }

  await user.update({
    telegramId: ctx.message.contact.user_id
  })

  ctx.reply('Теперь вы будете получать уведомления по указаному номеру.')
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