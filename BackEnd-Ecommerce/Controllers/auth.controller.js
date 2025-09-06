const jwt =require('jsonwebtoken')
const User=require('../Models/User.model')
const catchAsync =require('../utils/catch-async')

const signToken=(user)=>{
  return jwt.sign(
    {
        id:user._id,
        role:user.role,
        name:user.name
    },process.env.JWT_KEY,{
        expiresIn:process.env. JWT_EXPIRES_IN
    }
  )
}

exports.login=catchAsync(async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user || !(await user.correctPassword((password)))){
        res.status(401).json({message:'invalid email or password'})
    }
    else{
        res.status(200).json({message:'login successful',Token:signToken(user)})
    }
})