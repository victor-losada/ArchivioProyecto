import multer from 'multer';


const storage = multer.diskStorage({
    destination: (req, res, cb) =>{
        cb(null, 'public/documents')
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage: storage})

export default upload