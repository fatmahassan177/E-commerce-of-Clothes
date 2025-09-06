const Cart=require('../Models/Cart.model')
const catchAsync = require('../utils/catch-async');
const logger = require('../utils/logger.utils');
const Product=require('../Models/Product.model')


exports.AddToCart = catchAsync(async (req, res) => {
  const { productId, quantity, priceAtAdd } = req.body;
  const userId = req.user?._id;
  const product = await Product.findById(productId);
  if (!product || !product.isActive || product.isDeleted) {
    return res.status(404).json({ message: 'Product not available' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId: userId, items: [{ productId, quantity, priceAtAdd: product.price }] });
    logger.info('Product added to new cart');
    return res.status(200).json({ message: 'Product added', data: cart });
  } 
  else {
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].priceAtAdd = priceAtAdd || product.price;
    } 
    else {
      cart.items.push({ productId, quantity, priceAtAdd: product.price });
    }
    await cart.save();
    logger.info('Product added');
    return res.status(200).json({ message: 'Product added', data: cart });
  }
});


exports.UpdataCart = catchAsync(async (req, res) => {
  const { productId, action } = req.body;
  const userId = req.user?._id;
  if (!action || !['increase', 'decrease'].includes(action)) {
    return res.status(400).json({ message: 'Action must be increase or decrease' });
  }
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.status(400).json({ message: "Cart not found" });
  }
  const product = await Product.findById(productId);
  if (!product || !product.isActive || product.isDeleted) {
    return res.status(404).json({ message: 'Product not available' });
  }
  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Product not found in your cart' });
  }
  if (action === 'increase') {
    const newQuantity = cart.items[itemIndex].quantity + 1;
    if (product.stock < newQuantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
    cart.items[itemIndex].quantity = newQuantity;
  } else if (action === 'decrease') {
    cart.items[itemIndex].quantity -= 1;
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
  }
  await cart.save();
  logger.info(`Product updated`);
  res.status(200).json({ message: 'Cart updated successfully', data: cart, action: action });
});


exports.RemoveItem = catchAsync(async (req, res) => {
  const { productId } = req.params;  
  const userId = req.user?._id;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required in params' });
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.status(400).json({ message: "Cart not found" });
  }
  const itemIndex = cart.items.findIndex((item) => {
    const id = item.productId?._id ? item.productId._id : item.productId;
    return id && id.toString() === productId.toString();
  });

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Product not found in your cart' });
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  logger.info(`Product removed from cart`);
  return res.status(200).json({ message: 'Product removed from cart', data: cart });
});


exports.GetCart = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: 'User authentication required' });
  }

  const cart = await Cart.findOne({ userId }).populate('items.productId', 'title price imgurl');
  if (!cart) {
    return res.status(200).json({ message: 'Cart is empty', data: { items: [], totalPrice: 0 } });
  }
  const priceChangedItems = [];
  cart.items.forEach(item => {
    if (item.priceAtAdd !== item.productId.price) {
      priceChangedItems.push({
        productId: item.productId._id,
        productName: item.productId.title,
        oldPrice: item.priceAtAdd,
        newPrice: item.productId.price,
        quantity: item.quantity
      });
    }
  });

  logger.info(`Get cart successfully`);
  res.status(200).json({ message: 'Cart retrieved successfully', data: cart ,priceChangedItems: priceChangedItems });
});


exports.AcceptPriceChanges = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate('items.productId', 'price');
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  cart.items.forEach(item => {
    if (item.productId)
      { item.priceAtAdd = item.productId.price;}
  });
  await cart.save();
  res.json({ success: true, message: 'Prices updated', data: cart });
});

