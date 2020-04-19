import { Router } from 'express'
import userRoutes from './modules/users/user.route'
import authRouter from "./modules/auth/auth.route"

const api = Router();

api.use('/', authRouter)
api.use('/users', userRoutes)


export default api
