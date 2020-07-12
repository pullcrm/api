import jwt from 'jsonwebtoken'
import 'dotenv/config'

import ApiException from '../exceptions/api'
import getToken from '../utils/getToken'

const auth = () => (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next()
    }

    const authorization = req.headers.authorization2

    if (!authorization) {
      throw new ApiException(403, 'Authorization header isn\'t provided')
    }

    const token = getToken(authorization)

    if (!token) {
      throw new ApiException(403, 'Bad access token.')
    }

    jwt.verify(token, process.env.SECRET_FOR_JWT, async (err, payload) => {
      console.log('PAYLOAD', payload)
      if (err && err.name === 'TokenExpiredError') {
        throw new ApiException(401, 'Expired token.')
      }
      console.log(err)
      if (err) {
        throw new ApiException(500, 'Failed to authenticate token.')
      }

      req.userId = payload.userId
      req.companyId = payload.companyId
      req.role = payload.role

    })

    next()
  } catch(error) {
    next(error)
  }
}

export default auth
