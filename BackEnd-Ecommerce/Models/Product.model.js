const mongoose=require('mongoose')


const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imgurl: { type: String, required: true },
  route: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Limited Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });



   
ProductSchema.pre('save', function(next) {
  if (this.stock === 0) this.stockStatus = 'Out of Stock';
  else if (this.stock > 0 && this.stock <= 3) this.stockStatus = 'Limited Stock';
  else this.stockStatus = 'In Stock';
  next();
});

ProductSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.isActive = false;
  return this.save();
};




const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;