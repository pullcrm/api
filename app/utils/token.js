import jwt from 'jsonwebtoken'
import 'dotenv/config'
import ApiException from '../exceptions/api'

const accessTokenExpiring = '1h'
const refreshTokenExpiring = '30d'
const accessSecret = process.env.SECRET_FOR_JWT
const refreshSecret = process.env.SECRET_REFRESH_FOR_JWT

const generateAccessToken = (userId, companyId = 0, role = '-') => {
  return jwt.sign({userId, companyId, role}, accessSecret, {expiresIn: accessTokenExpiring})
}

const generateRefreshToken = userId => {
  return jwt.sign({userId}, refreshSecret, {expiresIn: refreshTokenExpiring})
}

const verifyAccessToken = accessToken => {
  try {
    return jwt.verify(accessToken, accessSecret)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiException(401, 'Expired access token')
    }

    throw new ApiException(500, 'Failed to authenticate access token')
  }
}
  
const verifyRefreshToken = refreshToken => {
  try {
    return jwt.verify(refreshToken, refreshSecret)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiException(401, 'Expired refresh token')
    }

    throw new ApiException(500, 'Failed to authenticate refresh token')
  }
}

const getTokenFromHeaders = authorizationHeader => {
  return authorizationHeader.split(' ')[1]
}

export {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, getTokenFromHeaders}