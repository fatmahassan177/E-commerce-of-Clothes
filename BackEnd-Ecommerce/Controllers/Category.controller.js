const Category = require('../Models/Categoey.model');
const Product = require('../Models/Product.model'); 
const catchAsync = require('../utils/catch-async');
const logger = require('../utils/logger.utils');
const memoryCache = require('../utils/memory-cache.utils');
const cacheKey = 'cachedProduct';


exports.AddCategory = catchAsync(async (req, res) => {
  const { name, parent, gender, isActive, isDeleted } = req.body;
  if (name) {
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: "Category name already exists" });
  }

  let parentDoc = null;
  if (parent) {
   
    if (/^[0-9a-fA-F]{24}$/.test(parent)) {
      parentDoc = await Category.findById(parent);
    } else {
   
      parentDoc = await Category.findOne({ name: parent });
    }
    if (!parentDoc) return res.status(400).json({ message: "Parent category not found" });
    if (gender && gender !== parentDoc.gender) {
      return res.status(400).json({ message: "Category gender must match parent category gender" });
    }
  }
  const category = await Category.create({ name, parent: parentDoc ? parentDoc._id : null, gender, isActive, isDeleted});
  memoryCache.del(cacheKey);
  logger.info('Category added');
  res.status(201).json({ message: "Category Added", data: category });
});

exports.UpdateCategory = catchAsync(async (req, res) => {
  const { name, parent, gender, isActive, isDeleted } = req.body;
  const updateData = {};
  if (name) {
    const existing = await Category.findOne({ name });
    if (existing && existing._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    updateData.name = name;
  }
  if (gender) updateData.gender = gender;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (isDeleted !== undefined) updateData.isDeleted = isDeleted;

  if (parent) {
    const parentDoc = await Category.findById(parent);
    if (!parentDoc) return res.status(400).json({ message: "Parent category not found" });
    if (gender && gender !== parentDoc.gender) {
      return res.status(400).json({ message: "Category gender must match parent category gender" });
    }
    updateData.parent = parentDoc._id;
  }

  const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!category) return res.status(404).json({ message: "Category not found" });
  memoryCache.del(cacheKey);
  logger.info('Category updated');
  res.status(200).json({ message: "Category Updated", data: category });
});


exports.DeleteCategory = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    logger.error('Category not found for deletion');
    return res.status(404).json({ message: "Category not found" });
  }

  const products = await Product.find({ category: req.params.id });
  if (products.length > 0) {
    const activeProducts = products.filter(product => !product.isDeleted);
    if (activeProducts.length > 0) {
      logger.warn('Cannot delete category due to active products');
      return res.status(400).json({
        message: "Cannot delete category because it has active (non-deleted) products",
        activeProducts: activeProducts.map(p => ({ id: p._id, name: p.title })) 
      });
    }
  }

  
  await category.softDelete();
  memoryCache.del(cacheKey);
  logger.info('Category soft deleted');
  return res.status(200).json({ message: "Category soft deleted" });
});


exports.getCategories = catchAsync(async (req, res) => {
  const { gender } = req.query;
  const filter = { isDeleted: false, isActive: true };

  if (gender) {
    filter.gender = gender;
  }

  const categories = await Category.find(filter).select('name gender').lean();
  res.status(200).json({ message: 'Categories', data: categories });
});






