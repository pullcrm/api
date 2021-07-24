import {Router} from 'express'
import FileController from './file.controller'
import auth from '../../middlewares/auth'
import {uploadImages, resizeImages, uploadImage, resizeImage} from '../../providers/files'

const router = Router()

router.get('/', auth(), FileController.findMyFiles)
router.post('/image', auth(), uploadImage, resizeImage, FileController.create)
router.post('/images', auth(), uploadImages, resizeImages, FileController.create)
router.get('/:id', auth(), FileController.getUserFiles)
router.delete('/:id', auth(), FileController.destroy)

export default router
