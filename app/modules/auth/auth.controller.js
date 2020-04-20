import bCrypt from 'bcrypt'
import AuthService from './auth.service'
import ApiException from "../../exceptions/api";
import createTokens from '../../utils/createTokens'

export default {
  login: async (req, res, next) => {
    try {
      const user = await AuthService.findByEmail(req.body.email)
      console.log(req.body.email)
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

  // refreshToken: (req, res, next) => {
  //   const token = req.headers['x-token-jwt'];
  //   if (!token) return res.status(403).send({auth: false, error: 'Unauthorized'});
  //   const refreshToken = req.body.refreshToken;
  //
  //   jwt.verify(refreshToken, config.secretRefresh, function (err, decoded) {
  //     if (err && err.name === 'TokenExpiredError')
  //       return res.status(401).send({auth: false, error: 'Expired refresh token'});
  //     if (err)
  //       return res.status(500).send({auth: false, error: 'Failed to authenticate refresh token.'});
  //
  //     const userId = decoded.userId;
  //     User.findOne({_id: userId}, {password: 0}).exec(function (err, user) {
  //       if (err) return res.status(404).send({message: 'User not found.'});
  //       //todo Need to handle different devices
  //       // if (user.refreshToken === refreshToken) {
  //       const {accessToken, refreshToken, expiresIn} = createTokens(user);
  //       user.refreshToken = refreshToken;
  //       user.save();
  //       res.status(200).send({accessToken, refreshToken, expiresIn});
  //       next();
  //       // } else res.status(403).send({ auth: false, error: 'Failed to authenticate refresh token.' });
  //     })
  //   });
  // },

  logout: (req, res) => {
    res.json({logout: true});
  }
}
