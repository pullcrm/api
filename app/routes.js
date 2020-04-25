import { Router } from 'express'
import userRoutes from './modules/users/user.route'
import authRouter from "./modules/auth/auth.route"
import appointmentRouter from "./modules/appointments/appointment.route";
import roleRouter from './modules/roles/role.route'

const api = Router();

api.use('/', authRouter)
api.use('/roles', roleRouter)
api.use('/users', userRoutes)
api.use('/appointments', appointmentRouter)


export default api
