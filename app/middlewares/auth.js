import 'dotenv/config'
import ApiException from '../exceptions/api'
import jwt from 'jsonwebtoken';

const auth = (params = {is: []}) => (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') return next();
    const token = req.headers['x-token-jwt'];

    if (!token) {
      throw new ApiException(403, 'Unauthorized')
    }

    jwt.verify(token, process.env.SECRET_KEY, function(err, user) {
      if (err && err.name === 'TokenExpiredError') {
        throw new ApiException(401, 'Expired token.')
      }

      if (err) {
        throw new ApiException(500, 'Failed to authenticate token.')
      }

      req.role = user.role;
      req.userId = user.id;
      req.companyId = user.company;
    });

    next();
  } catch(error) {
    next(error)
  }
};

module.exports = auth;
