import jwt from 'jsonwebtoken'
import 'dotenv/config'

const accessTokenExpiring = 700000
const refreshTokenExpiring = 1400000000

const createAccessToken = (userId, companyId = 0, role = '-') => {
  const secret = process.env.SECRET_FOR_JWT
  const accessToken = jwt.sign({userId, companyId, role}, secret, {expiresIn: accessTokenExpiring})
  const expiresIn = parseInt(new Date().getTime() / 1000, 10) + accessTokenExpiring

  return {accessToken, expiresIn}
}

const createRefreshToken = user => {
  return jwt.sign({userId: user.id}, process.env.SECRET_REFRESH_FOR_JWT, {expiresIn: 10})
}

export {createAccessToken, createRefreshToken}
