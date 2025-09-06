
const logger=require('../utils/logger.utils')
module.exports=(err,req,res,next)=>{
      
    err.statusCode=err.statusCode||500
    err.status =err.status ||'error'                  
    
  
logger.error(`Error occurred [${req.method} ${req.originalUrl}] | Message: ${err.message} | Stack: ${err.stack} | User: ${req.user?.id || 'guest'}`);


    if(process.env.NODE_ENV === 'development'){
        return res.status(err.statusCode).json({
            status:err.status,
            error:err,
            message:err.message,
            stack:err.stack
        })
    }

    return res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
    })
}