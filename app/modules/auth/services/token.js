import jwt from 'jsonwebtoken'
import TokenModel from "../models/token"
import ApiException from "../../../exceptions/api"

export default {
  create: (refreshToken, userId) => {
    return TokenModel.create({refreshToken, userId, device: 'web'})
  },

  leaveFiveTokens: async userId => {
    return TokenModel.sequelize.query(`
        DELETE FROM tokens
            WHERE userId = ${userId} and id NOT IN (
            SELECT id
            FROM (
                SELECT id
                FROM tokens
                ORDER BY id DESC
                LIMIT 5
            ) foo
        );
      `)
  },

  checkRefreshToken: async (refreshToken, userId) => {
    const hasToken = await TokenModel.findOne({where: {refreshToken, userId, device: 'web'}})

    if (!hasToken) {
      throw new ApiException(403, 'Failed to authenticate refresh token')
    }
  },

  deactivateRefreshTokens: async userId => {
    return TokenModel.destroy({where: {userId}})
  },
}
