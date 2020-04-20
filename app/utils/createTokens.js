import jwt from 'jsonwebtoken'
import 'dotenv/config'

const accessTokenExpiring = 700000;
const refreshTokenExpiring = 1400000000;

const createTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      company: user.company
    },
    process.env.SECRET_FOR_JWT,
    { expiresIn: accessTokenExpiring }
  );

  const refreshToken = jwt.sign({userId: user.id}, process.env.SECRET_REFRESH_FOR_JWT, {expiresIn: refreshTokenExpiring});
  const nowDate = parseInt(new Date().getTime() / 1000, 10);

  return { accessToken, refreshToken, expiresIn: nowDate + accessTokenExpiring }
};

export default createTokens
