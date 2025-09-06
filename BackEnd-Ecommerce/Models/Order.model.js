const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true, 
    },
    name: {
      type: String,
      required: true, 
    },
    image: {
      type: String, 
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    governorate: {
      type: String,
      required: true,
      enum: [
        'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Sharqia', 'Qalyubia', 'Kafr El Sheikh',
        'Gharbia', 'Monufia', 'Beheira', 'Ismailia', 'Suez', 'Port Said', 'Damietta',
        'Fayoum', 'Beni Suef', 'Minya', 'Assiut', 'Sohag', 'Qena', 'Luxor', 'Aswan',
        'Red Sea', 'New Valley', 'Matrouh', 'North Sinai', 'South Sinai'
      ],
    },
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready for Shipping', 'Shipped', 'Received', 'Rejected', 'Cancelled'],
    default: 'Pending',
  },
  payment: {
    type: String,
    enum: ['Cash on Delivery'], 
    default: 'Cash on Delivery',
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready for Shipping', 'Shipped', 'Received', 'Rejected', 'Cancelled'],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, 
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  cancelReason: {
    type: String,
    required: function() { return this.status === 'Cancelled'; }, 
  },
}, {
  timestamps: true, 
});




module.exports = mongoose.model('Order', orderSchema);