import {Router} from 'express'
import FileController from './file.controller'
import auth from '../../middlewares/auth'

const router = Router()

router.get('/', auth(), FileController.findMyFiles)
router.post('/', auth(), FileController.create)

export default router
