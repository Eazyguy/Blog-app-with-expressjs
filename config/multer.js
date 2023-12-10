const multer = require('multer')
const path = require('path')

// set Storage for multer

const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }
})

// init upload
module.exports = multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        const fileTypes = /jpeg|png|jpg|gif/
    // check ext
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    // check mimetype
        const mimetype = fileTypes.test(file.mimetype)

        if(mimetype && extname){
            return cb(null,true)
        }else{
            cb('Error:images only')
        }
    }
}).single('file')