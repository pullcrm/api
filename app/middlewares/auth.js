import 'dotenv/config'

import ApiException from '../exceptions/api'
import {getTokenFromHeaders, verifyAccessToken} from '../utils/token'

const auth = (accessRoles) => (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next()
    }

    const authorization = req.headers.authorization

    if (!authorization) {
      throw new ApiException(403, 'Authorization header isn\'t provided')
    }

    const token = getTokenFromHeaders(authorization)

    if (!token) {
      throw new ApiException(403, 'Bad access token.')
    }

    const {userId, companyId, role} = verifyAccessToken(token)

    if(accessRoles && !accessRoles.some(R => R === role)) {
      throw new ApiException(403, 'You don\'t have permissions for that operation')
    }

    req.userId = userId
    req.companyId = companyId
    req.roleName = role

    next()
  } catch(error) {
    next(error)
  }
}

export default auth
