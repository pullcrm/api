import {Router} from 'express'
import FileController from './file.controller'
import auth from '../../middlewares/auth'
import {uploadImages, resizeImages} from '../../providers/files'

const router = Router()

router.get('/', auth(), FileController.findMyFiles)
router.post('/images', auth(), uploadImages, resizeImages, FileController.createMultiple)
router.get('/:id', auth(), FileController.getUserFiles)
router.delete('/:id', auth(), FileController.destroy)

export default router
