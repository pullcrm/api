import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import AuthService from './auth.service'
import ApiException from "../../exceptions/api";
import createTokens from '../../utils/createTokens'
import getToken from "../../utils/getToken";

export default {
  login: async (req, res, next) => {
    try {
      const user = await AuthService.findByEmail(req.body.email)

      if(!user) {
        throw new ApiException(401, 'Invalid password or username')
      }

      const passwordIsValid = bCrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        throw new ApiException(401, 'Invalid password or username')
      }

      const {accessToken, refreshToken, expiresIn} = createTokens(user);

      user.refreshToken = refreshToken;

      await user.save()

      res.send({user, accessToken, refreshToken, expiresIn})
    } catch (error) {
      next(error)
    }
  },

  refreshToken: (req, res, next) => {
    const token = getToken(req.headers.authorization)

    if (!token) {
      throw new ApiException(403, 'Unauthorized')
    }

    //TODO refreshToken should be httpOnly
    const refreshToken = req.body.refreshToken;

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_FOR_JWT, async (err, payload) => {
      if (err && err.name === 'TokenExpiredError') {
        throw new ApiException(401, 'Expired refresh token')
      }

      if (err) {
        throw new ApiException(500, 'Failed to authenticate refresh token')
      }

      const userId = payload.userId;

      const user = await AuthService.findById(userId)

      //TODO Need to handle different devices
      // if (user.refreshToken === refreshToken) {
      const {accessToken, refreshToken, expiresIn} = createTokens(user);
      user.refreshToken = refreshToken;
      user.save();
      res.status(200).send({accessToken, refreshToken, expiresIn});
      next();
      // } else res.status(403).send({ auth: false, error: 'Failed to authenticate refresh token.' });
    });
  },

  logout: (req, res) => {
    res.json({logout: true});
  }
}
