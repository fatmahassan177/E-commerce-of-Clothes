const mongoose=require('mongoose')

const ContactSchema=new mongoose.Schema({
    FirstName:{ 
        type:String,
        required:true,
        minlength:3,
    maxlength:15,
    trim:true
    },
    LastName:{ 
        type:String,
        required:true,
        minlength:3,
    maxlength:15,
    trim:true
    },
    email:{
    type:String,
    match:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    required:true,
    lowercase:true,
},
  message: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 10,
         trim:true
    },
    type: {
        type: String,
        enum: {
            values: ['Complain', 'Normal Question'],
            message: 'Complain or Normal Question'
        },
        default: 'Normal Question',
        
    },
     isSeen: {
        type: Boolean,
        default: false,
        
    },
    isActive:{
         type: Boolean,
        default: true,
    },
    isDeleted:{
         type: Boolean,
        default: false,
    },

})

ContactSchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.isActive = false;
    return this.save();
};
const Contact =mongoose.model('Contact',ContactSchema)
module.exports=Contact