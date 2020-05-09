import {Router} from 'express'
import userRoutes from './modules/users/user.route'
import authRouter from "./modules/auth/auth.route"
import appointmentRouter from "./modules/appointments/appointment.route"
import roleRouter from './modules/roles/role.route'
import companyRouter from './modules/companies/company.route'
import cityRouter from './modules/cities/city.route'
import categoryRouter from './modules/categories/category.route'

const api = Router()

api.use('/', authRouter)
api.use('/roles', roleRouter)
api.use('/users', userRoutes)
api.use('/appointments', appointmentRouter)
api.use('/companies', companyRouter)
api.use('/cities', cityRouter)
api.use('/categories', categoryRouter)

export default api
