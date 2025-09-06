
const Product = require('../Models/Product.model');
const Category = require('../Models/Categoey.model');
const logger = require('../utils/logger.utils');
const memoryCache = require('../utils/memory-cache.utils');
const cacheKey = 'cachedProduct';
const CatchAsync = require('../utils/catch-async');
const fs = require('fs');





exports.getProductsByCategory = CatchAsync(async (req, res) => {
  const cacheKeyByCategory = 'cachedProductsByCategory';
  const cached = memoryCache.get(cacheKeyByCategory);
  if (cached) {
    logger.info('Returning cached products by category');
    return res.status(200).json({ message: 'Cached products by category', data: cached });
  }

  const productsByCategory = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category.name',
        products: {
          $push: {
            _id: '$_id',
            title: '$title',
            price: '$price',
            route: '$route',
            imgurl: '$imgurl',
            stock: '$stock',
            stockStatus: '$stockStatus'
          }
        }
      }
    }
  ]);

  memoryCache.set(cacheKeyByCategory, productsByCategory);
  logger.info('Fetched products grouped by category and cached them');
  res.status(200).json({ message: 'Products grouped by category', data: productsByCategory });
});

exports.getProduct = CatchAsync(async (req, res) => {
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    const products = cached.result || cached; 
    logger.info('Returning cached products');
    return res.status(200).json({ message: "Cached data", data: products });
  }

  if (res.paginatedResult && res.paginatedResult.result) {
    const populated = await Product.populate(res.paginatedResult.result, { path: 'category', select: 'name gender', strictPopulate: false });
    res.paginatedResult.result = populated;
    memoryCache.set(cacheKey, res.paginatedResult);
    logger.info('Fetched products from DB and cached them');
    return res.status(200).json({ message: "Paginated Product data", data: populated });
  }

  const products = await Product.find({ isDeleted: false })
    .populate('category', 'name gender')
    .lean();
  memoryCache.set(cacheKey, products);
  logger.info('Fetched products from DB and cached them');
  return res.status(200).json({ message: "Product data", data: products }); 
});


exports.addProduct = CatchAsync(async (req, res) => {
  const { title, desc, price, route, stock, category } = req.body;
  const imgurl = req.file ? req.file.filename : '';

    if (!title || !desc || price == null || stock == null || !category) {
    return res.status(400).json({ message: 'Title, description, price, stock, and category are required' });
  }
  if (!category) return res.status(400).json({ message: "Category is required" });



  const categoryDoc = await Category.findOne({ name: category });
  if (!categoryDoc) return res.status(400).json({ message: "Category not found" });

  const product = await Product.create({
    title, desc, price, route, stock,
    category: categoryDoc._id, imgurl
  });

  memoryCache.del(cacheKey);
  logger.info('product added');
  return res.status(200).json({ message: "product added", data: product });
});



exports.getProductByRoute = CatchAsync(async (req, res) => {
  const product = await Product.findOne({ route: req.params.route }).populate('category', 'name gender');
  if (!product) {
    logger.warn('cant get product by route');
    return res.status(500).json({ message: 'product not found' });
  }
  logger.info('get product by route');
  res.status(200).json({ message: "Product details", data: product });
});




exports.getRelatedProduct = CatchAsync(async (req, res) => {
  const route = req.params.route;
  const products = await Product.find({ route: { $ne: route } }).populate('category', 'name gender');
  logger.info('Get Related Products');
  res.status(200).json({ message: "related Products", data: products });
});




exports.updateProduct = CatchAsync(async (req, res) => {
  const { title, desc, price, route, stock, category } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const updateData = { title, desc, price, stock };

  if (category) {
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) return res.status(400).json({ message: "Category not found" });
    updateData.category = categoryDoc._id;
  }

  if (req.file) {
    const oldImage = `uploads/${product.imgurl}`;
    if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
    updateData.imgurl = req.file.filename;
  }

  if (route && route !== product.route) {
    const exists = await Product.findOne({ route });
    if (exists) return res.status(400).json({ message: 'Route already exists for another product' });
    updateData.route = route;
  }

  if (stock === 0) updateData.stockStatus = 'Out of Stock';
  else if (stock > 0 && stock <= 3) updateData.stockStatus = 'Limited Stock';
  else updateData.stockStatus = 'In Stock';

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('category', 'name gender');

  memoryCache.del(cacheKey);
  logger.info('Product updated with stock status');
  res.status(200).json({ message: 'Product updated', data: updatedProduct });
});




exports.softDeleteProduct = CatchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.softDelete();
  memoryCache.del(cacheKey);
  logger.info('Product soft deleted');
  res.status(200).json({ message: 'Product soft deleted' });
});



exports.getSortedProducts = CatchAsync(async (req, res) => {
  const sortby = req.query.sortby || 'createdAt';
  const order = req.query.order === 'desc' ? -1 : 1;

  if (res.paginatedResult) {
    const sorted = res.paginatedResult.result.sort((a, b) => {
      if (sortby === 'price') return order * (a.price - b.price);
      if (sortby === 'title') return order * a.title.localeCompare(b.title);
      return 0;
    });
    const populated = await Product.populate(sorted, { path: 'category', select: 'name gender' });
    return res.status(200).json({ message: "Paginated & Sorted Products", ...res.paginatedResult, result: populated });
  }

  const products = await Product.find().sort({ [sortby]: order }).populate('category', 'name gender');
  res.status(200).json({ message: "Sorted Products", data: products });
});


exports.filterProducts = CatchAsync(async (req, res) => {
  const { category, gender, stockStatus } = req.query;
  const filter = { isDeleted: false };

 
  if (gender) {
    const categoriesWithGender = await Category.find({ gender, isDeleted: false, isActive: true });
    if (categoriesWithGender.length === 0) {
      return res.status(404).json({ message: 'لا توجد فئات لهذا الجندر' });
    }
    filter.category = { $in: categoriesWithGender.map(c => c._id) };
  }

  
  if (category) {
    const categoryDoc = await Category.findOne({ name: category, gender: gender || { $exists: true }, isDeleted: false, isActive: true });
    if (!categoryDoc) {
      return res.status(404).json({ message: 'not found category' });
    }
    filter.category = categoryDoc._id;
  }

  if (stockStatus) {
    filter.stockStatus = stockStatus;
  }

  const products = await Product.find(filter).populate('category', 'name gender').lean();

  if (products.length === 0) {
    return res.status(200).json({ message: 'not found product', data: [] });
  }

  res.status(200).json({ message: 'data', data: products });
});


exports.searchProducts = CatchAsync(async (req, res) => {
  const keyword = req.query.q || req.query.title || '';

  if (res.paginatedResult) {
    const filtered = res.paginatedResult.result.filter(p =>
      p.title.toLowerCase().includes(keyword.toLowerCase())
    );
    const populated = await Product.populate(filtered, { path: 'category', select: 'name gender' });
    return res.status(200).json({ message: "Paginated search results", ...res.paginatedResult, result: populated });
  }

  const products = await Product.find({ title: { $regex: keyword, $options: 'i' } }).populate('category', 'name gender');
  res.status(200).json({ message: "Search results", data: products });
});
