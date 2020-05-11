import mailer from 'nodemailer'

class Mailer {
  constructor() {
    this.transporter = {}

    this.init().catch(e => console.log(e))
  }

  async init() {
    this.transporter = mailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
      }
      // host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      // auth: {
      //   user: testAccount.user, // generated ethereal user
      //   pass: testAccount.pass // generated ethereal password
      // }
    })
  }

  async send({from, to, subject, text, html}) {
    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    })

    console.log("Message sent: %s", info)
    return info
  }

}

export default new Mailer()
