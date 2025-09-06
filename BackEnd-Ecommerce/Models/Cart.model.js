const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    items: [
      {
        
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        priceAtAdd: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);


CartSchema.pre('save', async function (next) {
  if (this.isModified('items')) {
    let total = 0;
    for (let item of this.items) {
      total += item.priceAtAdd * item.quantity;
    }
    this.totalPrice = total;
  }
  next();
});




const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;