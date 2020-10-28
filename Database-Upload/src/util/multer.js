const multer = require('multer');


const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./archive')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const upload = multer({
    storage:fileStorage
})

module.exports = upload;