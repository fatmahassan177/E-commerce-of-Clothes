const catchAsync =require('../utils/catch-async')
const User=require('../Models/User.model')


exports.getUsers=catchAsync(async(req,res)=>{
  const users = await User.find().select('-password')
  res.status(200).json({message:"user data",data:users})
})


exports.CreateUser=(role)=>{

    return catchAsync(async(req,res)=>{
    const {name,email,password,address} =req.body
    if (!name || !email || !password || !address || !address.street || !address.city || !address.governorate) {
        return res.status(400).json({  status: 'error',  message: 'Please provide all required fields: name, email, password, street, city, and governorate.'
        });
      }

     
      const user = await User.create({name,email,password,address,role})
     res.status(200).json({message:`${role} Created`,data:user})
})}


exports.DeleteUser=catchAsync(async(req,res)=>{
  const id =req.params.id
  const user=await User.findById(id)
  await user.softDelete()
  logger.info('User soft deleted');
  res.status(200).json({ message: 'User soft deleted' });
})
