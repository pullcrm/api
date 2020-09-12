const FormData = require('form-data')

export default class SmsClient {
  constructor ({login, password}) {
    this.endpoint = 'https://smsc.ua/sys/'
    this.password = password
    this.login = login
  }

  read_url ({file, params}) {
    const fd = new FormData()

    params = {
      ...this.params,
      ...params
    }

    for (const i in params) {
      fd.append(i, params[i])
    }

    return new Promise((resolve, reject) => {
      fd.submit(this.endpoint + file, (err, res) => {
        if (err) {
          reject(err)
        }

        res.setEncoding(this.charset)

        res.on('data', data => {
          resolve(data)
        })
      })
    })
  }

  sendSms (params) {
    return this.read_url({
      file: 'send.php',
      params
    })
  }

  removeSms (params) {
    return this.read_url({
      file: 'status.php',
      params: {
        del: 1,
        ...params,
      }
    })
  }

  getSmsStatus (params) {
    return this.read_url({
      file: 'status.php',
      params
    })
  }

  getBalance (params) {
    return this.read_url({
      file: 'balance.php',
      params
    })
  }

  get params () {
    return {
      charset: 'utf-8',
      login: this.login,
      psw: this.password,
      fmt: 3
    }
  }
}
