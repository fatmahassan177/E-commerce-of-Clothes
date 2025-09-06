const express = require('express');
const router = express.Router();
const { AddCategory, UpdateCategory, DeleteCategory, getCategories} = require('../Controllers/Category.controller');
const { authenticate } = require('../Middlewares/auth.middleware');
const { authorize } = require('../Middlewares/role.middleware');


router.get('/',  getCategories);


router.post('/', authenticate, authorize('admin'), AddCategory);


router.put('/:id', authenticate, authorize('admin'), UpdateCategory);

router.delete('/:id', authenticate, authorize('admin'), DeleteCategory);

module.exports = router;
