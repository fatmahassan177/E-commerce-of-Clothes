const mongoose = require('mongoose');


TestimonialsSchema=new mongoose.Schema({
    userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
     rating: {
    type: Number,
    required: true,
    min: 1, 
    max: 5
     },
  comment: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isApproved:{
    type: Boolean,
    default: false
  },
  isSeen:{
    type: Boolean,
    default: false
  },

}, {
  timestamps: true
});
   
TestimonialsSchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.isActive = false;
    return this.save();
};
const Testimonials =mongoose.model('Testimonials',TestimonialsSchema)
module.exports=Testimonials
