import multer from 'multer'
import mkdirp from 'mkdirp'
import path from 'path'
import ApiException from '../../exceptions/api'
import sharp from 'sharp'
import fs from 'fs'

const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
    
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return cb(new ApiException(400, 'Only images are allowed'))
  }
    
  cb(null, true)
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/' + Date.now()
      
    mkdirp(dir, err => cb(err, dir))
  },
      
  filename: (req, file, cb) => cb(null, file.originalname),
})

const setFileName = (width, filename) => `${width}x${filename}`

const resize = async (file, sizes) => {
  return await Promise.all(sizes.map(S => {
    return sharp(file.path)
      // .toFormat('jpeg')
      .resize(S)
      // .jpeg({
      //   quality: 100,
      //   mozjpeg: true
      // })
      .toFile(
        path.resolve(file.destination, setFileName(S, file.filename))
      )
  }))
}

const setWidth = (customWidth, width) => customWidth ? [customWidth] : width

export const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
}).array('files', 20)

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
}).single('file')

export const resizeImages = async (req, res, next) => {
  try {
    for (const i in req.files){
      const file = req.files[i]
      const {width} = await sharp(file.path).metadata()

      if(width >= 1600) {
        await resize(file, [1600, 800, 160])
      }

      if(width >= 800 && width < 1600) {
        await resize(file, [800, 160])
      }

      if(width < 800) {
        await resize(file, [160])
      }
    
      fs.unlinkSync(file.path)
    }
    
    next()
  } catch(error) {
    console.log(error)
    next(new ApiException(400, 'File is damaged, try another'))
  }
}

export const resizeImage = async (req, res, next) => {
  try {
    const file = req.file
    const {width} = await sharp(file.path).metadata()
    const customWidth = +req.body.width
    const originalPath = file.path
    let producedFile

    if(customWidth && customWidth > width) [
      next(new ApiException(400, 'Original width is smaller than custom width!'))
    ]
    
    if(width >= 1600) {
      const sizes = [1600, 800, 160]
      producedFile = await resize(file, setWidth(customWidth, sizes))
      file.sizes = sizes
    }

    if(width >= 800 && width < 1600) {
      const sizes = [800, 160]
      producedFile = await resize(file, setWidth(customWidth, sizes))
      file.sizes = sizes
    }

    if(width < 800) {
      const sizes = [160]
      producedFile = await resize(file, setWidth(customWidth, sizes))
      file.sizes = sizes
    }

    if(producedFile) {
      fs.unlinkSync(originalPath)
      file.size = producedFile[0].size
    }

    next()
  } catch(error) {
    console.log(error)
    next(new ApiException(400, 'File is damaged, try another'))
  }
}
