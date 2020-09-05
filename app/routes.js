import {Router} from 'express'
import userRoutes from './modules/users/user.route'
import authRouter from "./modules/auth/auth.route"
import appointmentRouter from "./modules/appointments/appointment.route"
import roleRouter from './modules/roles/role.route'
import companyRouter from './modules/companies/company.route'
import cityRouter from './modules/cities/city.route'
import categoryRouter from './modules/categories/category.route'
import approachRouter from './modules/approaches/approach.route'
import procedureRouter from './modules/procedures/procedure.route'
import fileRouter from './modules/files/file.route'
import notificationRouter from './modules/notification/notification.route'

const api = Router()

api.use('/', authRouter)
api.use('/roles', roleRouter)
api.use('/users', userRoutes)
api.use('/appointments', appointmentRouter)
api.use('/companies', companyRouter)
api.use('/cities', cityRouter)
api.use('/categories', categoryRouter)
api.use('/approaches', approachRouter)
api.use('/procedures', procedureRouter)
api.use('/files', fileRouter)
api.use('/notification', notificationRouter)

export default api
