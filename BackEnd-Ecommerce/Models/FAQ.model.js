const mongoose=require('mongoose')

const FAQSchema =new mongoose.Schema({
     question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
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

FAQSchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.isActive = false;
    return this.save();
};
const FAQ =mongoose.model('FAQ',FAQSchema)
module.exports=FAQ