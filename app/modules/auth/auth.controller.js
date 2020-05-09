import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import joi from 'joi'
import AuthService from './auth.service'
import ApiException from "../../exceptions/api"
import {createAccessToken, createRefreshToken} from '../../utils/createTokens'
import validate from "../../utils/validate"

export default {
  login: async (req, res, next) => {
    try {
      const formattedData = {
        email: req.body.email,
        password: req.body.password
      }

      validate(formattedData, joi.object().keys({
        email: joi.string().email().max(256).required(),
        password: joi.string().max(256).required()
      }));

      const user = await AuthService.findBy({email: formattedData.email})

      if(!user) {
        throw new ApiException(401, 'Invalid password or username')
      }

      const passwordIsValid = bCrypt.compareSync(formattedData.password, user.password);

      if (!passwordIsValid) {
        throw new ApiException(401, 'Invalid password or username')
      }

      const {accessToken, expiresIn} = createAccessToken(user.id);
      const refreshToken = createRefreshToken(user.get({ plain: true }))

      user.refreshToken = refreshToken;

      await user.save()

      res.send({accessToken, refreshToken, expiresIn})
    } catch (error) {
      next(error)
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const formattedData = {
        //TODO refreshToken should be httpOnly
        refreshToken: req.body.refreshToken,
        companyId: req.body.companyId,
        role: req.body.role
      }

      validate(formattedData, joi.object().keys({
        refreshToken: joi.string().required(),
        companyId: joi.number().optional(),
        role: joi.string().optional(),
      }));

      const payload = jwt.verify(formattedData.refreshToken, process.env.SECRET_REFRESH_FOR_JWT)
      const userId = payload.userId;
      const user = await AuthService.findBy({id: userId})

      //TODO may need to handle different devices in future
      if (user.refreshToken !== formattedData.refreshToken) {
        throw new ApiException(403, 'Failed to authenticate refresh token')
      }

      //TODO add condition about roles/companies
      const {accessToken, expiresIn} = createAccessToken(user.id, formattedData.companyId, formattedData.role);

      res.status(200).send({accessToken, expiresIn});

    } catch (error) {
      next(error)
    }
  },

  logout: (req, res) => {
    //TODO need deactivate tokens that not expired
    res.json({logout: true});
  }
}
