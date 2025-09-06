
const multer=require('multer')
const path=require('path')

const fileFilter=(req,file,cb)=>{                 
    const ext=path.extname(file.originalname).toLowerCase()
   /// file.mimetype  ///file-type
    const allowed=['.png','.jpg','.jpeg','.webp']
    if(!allowed.includes(ext)){
        cb(new Error('only images allowed (.png,.jpg,.jpeg,.webp)'),false)
    }
    cb(null,true)
}
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')           
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}_${file.originalname}`)
    }
})

const MG=1024*1024
const upload=multer({
    storage,
    fileFilter,
    limits:{fileSize:2*MG}  //2MG

})

module.exports=upload

