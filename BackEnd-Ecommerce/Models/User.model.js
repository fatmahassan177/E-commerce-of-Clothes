const mongoose=require('mongoose')
const bcrybt=require('bcrypt')

const UserSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email address'],
    required:true,
    lowercase:true,
    unique:true,
  },
  password:{
     type:String,
    required:true,
    match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must be at least 6 characters and contain letters and numbers']
  },
  address:{
    street: { type: String, required: true, trim: true ,required: function() { return this.role === 'user'; } },
    city: { type: String, required: true, trim: true ,required: function() { return this.role === 'user'; } },
    governorate: { 
      type: String, 
     required: function() { return this.role === 'user'; } ,
      enum: [
        'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Sharqia', 'Qalyubia', 'Kafr El Sheikh',
        'Gharbia', 'Monufia', 'Beheira', 'Ismailia', 'Suez', 'Port Said', 'Damietta',
        'Fayoum', 'Beni Suef', 'Minya', 'Assiut', 'Sohag', 'Qena', 'Luxor', 'Aswan',
        'Red Sea', 'New Valley', 'Matrouh', 'North Sinai', 'South Sinai'
      ]
    },
    
    
  },
  
  role:{
        type:String,
       enum:['admin','user'],
       default:'user'
   },
   isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }

},{
    timestamps:true
}
)
UserSchema.pre('save',async function (next){
    if(!this.isModified('password'))next()
     this.password=await bcrybt.hash(this.password,12)
    next()
})

UserSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.isActive = false;
  return this.save();
};


UserSchema.methods.correctPassword=async function(inputpassword){
  return  await bcrybt.compare(inputpassword,this.password)
}



module.exports=mongoose.model('User',UserSchema)