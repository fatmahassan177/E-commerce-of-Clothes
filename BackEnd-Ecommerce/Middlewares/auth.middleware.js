const User =require('../Models/User.model')
const JWT=require('jsonwebtoken')

exports.authenticate=async(req,res,next)=>{
  const authHeader=req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({message:'no token provider'})
  }

  const token =authHeader.split(' ')[1]

  try{
    const decode=JWT.verify(token,process.env.JWT_KEY)
    const user= await User.findById(decode.id).select('-password')
    req.user=user
    next()
  }
  catch(err){
    res.status(403).json({message:'invalid token'})
  }
  console.log(authHeader)
}