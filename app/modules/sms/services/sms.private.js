import ApiException from '../../../exceptions/api'
import {privateSMS} from '../../../providers/smsc'
import SMSConfigurationModel from '../sms.model'
import CompanyModel from '../../companies/models/company'
import {decrypt} from '../../../utils/crypto'

export default {
  addSMSConfiguration: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    return SMSConfigurationModel.create({
      ...data,
      companyId
    })
  },

  updateSMSConfiguration: async (data, {companyId, userId}) => {
    const company = await CompanyModel.findOne({where: {id: companyId}})
    const smsConfiguration = await SMSConfigurationModel.findOne({companyId: company.id})

    if(company.get('userId') !== userId) {
      throw new ApiException(403, 'You don\'t own this company!')
    }

    return smsConfiguration.update(data)
  },

  send: async ({phone, message, id, time}, companyId) => {
    const smsConfig = await SMSConfigurationModel.findOne({companyId})

    if(!smsConfig) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const creds = {
      login: smsConfig.login,
      psw: decrypt(JSON.parse(smsConfig.password))
    }

    return privateSMS(creds).send({
      id,
      time,
      phones: phone,
      mes: message,
      psw: creds.psw
    })
  },

  balance: async ({companyId}) => {
    const smsConfig = await SMSConfigurationModel.findOne({companyId})

    if(!smsConfig) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const creds = {
      login: smsConfig.login,
      psw: decrypt(JSON.parse(smsConfig.password))
    }

    return privateSMS(creds).getBalance(creds)
  },

  status: async ({phone, smsIdentifier}, companyId) => {
    const smsConfig = await SMSConfigurationModel.findOne({companyId})

    if(!smsConfig) {
      throw new ApiException(404, 'SMS Config was not found')
    }

    const creds = {
      login: smsConfig.login,
      psw: decrypt(JSON.parse(smsConfig.password))
    }
    
    return privateSMS(creds).getStatus({
      phone,
      all: 1,
      id : smsIdentifier,
      psw: creds.psw,
      login: creds.login
    })
  }
}