import {TurboSMS} from 'turbosms-http'
import puppeteer from 'puppeteer'
import {addUAFormat} from '../../utils/phone'

const turboSMS = new TurboSMS({
  accessToken: '480b43fb98ec688a932fd3f2b49b068ff5913eca'
})

turboSMS.message.delete = async ({phone, message}) => {
  try {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.setViewport({width: 1200, height: 720})
    await page.goto('https://turbosms.ua/', {waitUntil: 'networkidle0'})
    await page.click('#login_btn')
    await page.type('#auth_login', 'inum93')
    await page.type('#auth_password', '27529ura')
  
    await Promise.all([
      page.click('#submit_auth'),
      page.waitForNavigation({waitUntil: 'networkidle0'}),
    ])
  
    await Promise.all([
      page.click('#submenu-item-sended'),
      page.waitForNavigation({waitUntil: 'networkidle0'}),
    ])

    await page.type('#number', addUAFormat(phone)) 
    await page.type('#text', message)
  
    await page.click('.button-confirm')
    
    await page.waitForSelector('.error')
    const text = await page.$eval('.error', element => element.textContent)

    if(text === 'По Вашему запросу сообщений не найдено') {
      return {
        status: "FAILED",
        error: 'There are no such SMS'
      }
    }

    await page.waitForSelector('a.no-row-click')
    await page.click('a.no-row-click')

    return {
      status: "SUCCESS"
    }
  } catch (error) {
    return {
      status: 'FAILED',
      error
    }
  }
}

export default turboSMS