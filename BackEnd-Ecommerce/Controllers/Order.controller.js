const Order = require('../Models/Order.model');
const Cart = require('../Models/Cart.model');
const Product = require('../Models/Product.model');
const User = require('../Models/User.model');
const catchAsync = require('../utils/catch-async');
const logger = require('../utils/logger.utils');

exports.CreateOrder=catchAsync(async(req,res)=>{
    const {cart,address} =req.body
    const userId=req.user?._id
    if (!userId) {
    return res.status(401).json({ message: 'Authentication required to create an order' });
  }
  if (!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty or invalid' });
  }
  if (!address || !address.street || !address.city || !address.governorate) {
    return res.status(400).json({ message: 'Complete address is required' });
  }
  const products = [];
  let totalPrice = 0;

  for (const item of cart.items) {

    const product = await Product.findById(item.productId);
    console.log(product)
    if (!product || !product.isActive || product.isDeleted) {
      return res.status(404).json({ message: `Product not available` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: 'Insufficient stock'});
    }
  
    products.push({ productId: product._id, quantity: item.quantity, price: product.price, name: product.title, image: product.imgurl, });
    totalPrice += product.price * item.quantity;
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create(
    { userId, products, totalPrice, address, 
    status: 'Pending', 
    statusHistory: [{status: 'Pending',changedBy: userId,changedAt: new Date(), }]}
  );

 await Cart.findOneAndDelete({ userId });
  logger.info(`Order created for user ${userId}: ${order._id}`);
  res.status(201).json({ message: 'Order created successfully' , data: order,});
});
  
exports.getOrders = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required to view orders' });
  }
  const orders = await Order.find({ userId }).populate('products.productId', 'title price imgurl').populate('statusHistory.changedBy', 'name');
  res.status(200).json({ message: 'Orders retrieved successfully', data: orders,});
});


exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status, cancelReason } = req.body;
  if (status === 'Cancelled' && !cancelReason) {
    return res.status(400).json({ message: 'Cancel reason is required for cancellation' });
  }
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  order.status = status;
  if (status === 'Cancelled') {
    order.cancelReason = cancelReason;
    for (const product of order.products) {
      const dbProduct = await Product.findById(product.productId);
      if (dbProduct && !dbProduct.isDeleted && dbProduct.isActive) {
        dbProduct.stock += product.quantity;
        await dbProduct.save();
      }
    }
  }
  order.statusHistory.push({ status, changedBy: req.user._id, changedAt: new Date()});
  await order.save();
  logger.info(`Order status updated to canceld by admin ${req.user._id}`);
  res.status(200).json({ message: `Order status updated to canceld` ,data: order,});
});


exports.cancelOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { cancelReason } = req.body;
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required to cancel order' });
  }
  if (!cancelReason) {
    return res.status(400).json({ message: 'Cancel reason is required' });
  }
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.userId.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Unauthorized to cancel this order' });
  }
  if (!['Pending', 'Preparing'].includes(order.status)) {
    return res.status(400).json({ message: 'Only Pending or Preparing orders can be cancelled' });
  }
  for (const product of order.products) {
    const dbProduct = await Product.findById(product.productId);
    if (dbProduct && !dbProduct.isDeleted && dbProduct.isActive) {
      dbProduct.stock += product.quantity;
      await dbProduct.save();
    }
  }
  order.status = 'Cancelled';
  order.cancelReason = cancelReason;
  order.statusHistory.push({ status: 'Cancelled', changedBy: userId, changedAt: new Date(),});
  await order.save();
  logger.info(`Order cancelled by user `);
  res.status(200).json({message: 'Order cancelled successfully',data: order,});
});


exports.getPendingOrders = catchAsync(async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  const pendingOrders = await Order.find({ status: 'Pending' }).populate('userId', 'name email').populate('products.productId', 'title price imgurl').sort({ createdAt: -1 }) 
    logger.info(`Pending orders retrieved successfully`);
  res.status(200).json({ message: 'Pending orders retrieved successfully', data: pendingOrders, count: pendingOrders.length});
});

exports.getAllOrdersForAdmin = catchAsync(async (req, res) => {
 if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  const orders = await Order.find() .populate('userId', 'name email') .populate('products.productId', 'title price imgurl') .populate('statusHistory.changedBy', 'name').sort({ createdAt: -1 }); 
   logger.info(`All orders retrieved successfully`);
  res.status(200).json({message: 'All orders retrieved successfully',data: orders,count: orders.length});
});