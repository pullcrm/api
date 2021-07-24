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
      .resize(S)
      .toFile(
        path.resolve(file.destination, setFileName(S, file.filename))
      )
  }))
}

const setWidth = (customWidth, width) => customWidth ? customWidth : width

export const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
}).array('files', 20)

export const resizeImages = async (req, res, next) => {
  try {
    for (const i in req.files){
      const file = req.files[i]
      const {width} = await sharp(file.path).metadata()
      const customWidths = typeof req.body.widths === 'string' && req.body.widths.split(',').map(W => +W)
      const originalPath = file.path
      let producedFile

      if(customWidths && customWidths.some(W => W > width)) {
        next(new ApiException(400, 'Original width is smaller than custom width!'))
      }
      
      if(width >= 1600) {
        const sizes = setWidth(customWidths, [1600, 800, 160]) 
        producedFile = await resize(file, sizes)
        file.sizes = sizes
      }
  
      if(width >= 800 && width < 1600) {
        const sizes = setWidth(customWidths, [800, 160]) 
        producedFile = await resize(file, sizes)
        file.sizes = sizes
      }
  
      if(width < 800) {
        const sizes = setWidth(customWidths, [160]) 
        producedFile = await resize(file, sizes)
        file.sizes = sizes
      }

      if(producedFile) {
        fs.unlinkSync(originalPath)
      }
    }
    
    next()
  } catch(error) {
    console.log(error)
    next(new ApiException(400, 'File is damaged, try another'))
  }
}

