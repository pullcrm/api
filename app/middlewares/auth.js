import jwt from 'jsonwebtoken';
import 'dotenv/config'

import ApiException from '../exceptions/api'
import getToken from '../utils/getToken'

const auth = (params = {is: []}) => (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const token = getToken(req.headers.authorization)

    if (!token) {
      throw new ApiException(403, 'Unauthorized')
    }

    jwt.verify(token, process.env.SECRET_FOR_JWT, function(err, user) {
      if (err && err.name === 'TokenExpiredError') {
        throw new ApiException(401, 'Expired token.')
      }

      if (err) {
        throw new ApiException(500, 'Failed to authenticate token.')
      }

      console.log(user.company)

      req.role = user.role;
      req.userId = user.id;
      req.companyId = user.company;
    });

    next();
  } catch(error) {
    next(error)
  }
};

export default auth;
