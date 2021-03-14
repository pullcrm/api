import {Router} from 'express'
import userRoutes from './modules/users/user.route'
import authRouter from "./modules/auth/auth.route"
import appointmentRouter from "./modules/appointments/routes/appointment.private"
import appointmentPublicRouter from "./modules/appointments/routes/appointment.public"
import roleRouter from './modules/roles/role.route'
import companyRouter from './modules/companies/routes/company.private'
import companyPublicRouter from './modules/companies/routes/company.public'
import cityRouter from './modules/cities/city.route'
import categoryRouter from './modules/categories/category.route'
import specialistRouter from './modules/specialists/routes/specialist.private'
import specialistPublicRouter from './modules/specialists/routes/specialist.public'
import procedureRouter from './modules/procedures/routes/procedure.private'
import procedurePublicRouter from './modules/procedures/routes/procedure.public'
import fileRouter from './modules/files/file.route'
import smsRouter from './modules/sms/sms.route'
import timeOffRouter from './modules/timeoff/timeoff.route'
import analyticsRouter from './modules/analytics/analytics.route'

const api = Router()

api.use('/', authRouter)
api.use('/roles', roleRouter)
api.use('/users', userRoutes)
api.use('/appointments', appointmentRouter)
api.use('/companies', companyRouter)
api.use('/cities', cityRouter)
api.use('/categories', categoryRouter)
api.use('/specialists', specialistRouter)
api.use('/procedures', procedureRouter)
api.use('/files', fileRouter)
api.use('/sms', smsRouter)
api.use('/timeoff', timeOffRouter)
api.use('/analytics', analyticsRouter)

api.use('/public/specialists', specialistPublicRouter)
api.use('/public/procedures', procedurePublicRouter)
api.use('/public/appointments', appointmentPublicRouter)
api.use('/public/companies', companyPublicRouter)

export default api
