import jwt from 'jsonwebtoken'
import 'dotenv/config'

const accessTokenExpiring = 700000;
const refreshTokenExpiring = 1400000000;

const createAccessToken = (user) => {
  const companies = user.approaches.map(A => ({id: A.companyId, role: A.role.name}))

  const accessToken = jwt.sign(
    {
      userId: user.id,
      companies
    },
    process.env.SECRET_FOR_JWT,
    { expiresIn: accessTokenExpiring }
  );

  return { accessToken, expiresIn: parseInt(new Date().getTime() / 1000, 10) + accessTokenExpiring }
}

const createRefreshToken = (user) => {
  return jwt.sign({userId: user.id}, process.env.SECRET_REFRESH_FOR_JWT, {expiresIn: refreshTokenExpiring});
}

export {createAccessToken, createRefreshToken}
