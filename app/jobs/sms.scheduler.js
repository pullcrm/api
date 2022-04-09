import Queue from "bull"
import * as Sentry from '@sentry/node'
import lifecell from "../providers/lifecell"
import SMSHistoryModel from "../modules/sms/models/history.model"

class SMSScheduler {
  init({port, host, password}) {
    this.smsQueue = new Queue('SMS_SCHEDULER', {redis: {port, host, password}})

    this.smsQueue.process(async ({data: {message, phone, alphaName}}, done) => {
      try {
        const response = await lifecell.sendOneSMS({message, phone, alphaName})
        
        if(response.state.value === 'Accepted') {
          return done(null, response)
        }

        done(new Error(`${response.state.value}:${response.id}`))
      } catch (error) {
        done(error)
      }
    })
    
    this.smsQueue.on('completed', async (job, result) => {
      const smsHistory = await SMSHistoryModel.findOne({where: {jobId: job.id}})
      
      if(!smsHistory) {
        Sentry.captureException(new Error(`SMS History wasn't found by jobId: ${job.id}`))
      }

      console.log(result)

      await smsHistory.update({
        status: result.state.value.toUpperCase(),
        lifecellId: result.id,
        sendDate: result.date
      })

      job.remove()
    })
    
    this.smsQueue.on('failed', async (job, err) => {
      const smsHistory = await SMSHistoryModel.findOne({where: {jobId: job.id}})
      
      if(!smsHistory) {
        Sentry.captureException(new Error(`SMS History wasn't found by jobId: ${job.id}`))
      }

      await smsHistory.update({
        lifecellId: err.message.split(':')[1],
        price: 0,
        status: err.message.split(':')[0].toUpperCase(),
      })

      Sentry.captureException(err)
      job.remove()
    })
  }
}

export default new SMSScheduler

