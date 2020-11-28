const FormData = require('form-data')

export default class SMSClient {
  constructor (data) {
    console.log('CREDS', data)
    this.endpoint = 'https://smsc.ua/sys/'
    this.password = data.password
    this.login = data.login
  }

  read_url ({file, params}) {
    const fd = new FormData()

    params = {
      ...this.params,
      ...params
    }

    for (const i in params) {
      console.log('INNER PARAMS', params)
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

  send(params) {
    return this.read_url({
      file: 'send.php',
      params
    })
  }

  remove(params) {
    return this.read_url({
      file: 'status.php',
      params: {
        del: 1,
        ...params,
      }
    })
  }

  getStatus(params) {
    return this.read_url({
      file: 'status.php',
      params
    })
  }

  getBalance(params) {
    return this.read_url({
      file: 'balance.php',
      params
    })
  }

  get params() {
    return {
      charset: 'utf-8',
      login: this.login,
      psw: this.password,
      fmt: 3
    }
  }
}
