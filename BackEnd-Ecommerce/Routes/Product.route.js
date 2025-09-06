const express =require('express')
const  router=express.Router()
const upload=require('../Middlewares/upload.middleware')
const{getProduct,getProductsByCategory,getProductByRoute,addProduct,getRelatedProduct,updateProduct,softDeleteProduct,searchProducts,filterProducts,getSortedProducts}=require('../Controllers/Product.controller')
const {authenticate}=require('../Middlewares/auth.middleware')
const {authorize}=require('../Middlewares/role.middleware')
const paginate=require('../Middlewares/pagination.middleware')
const product=require('../Models/Product.model')



router.get('/',getProduct);
router.post('/',authenticate,authorize('admin'),upload.single('img'),addProduct)
router.put('/:id',authenticate,authorize('admin'),upload.single('img'),updateProduct)
router.delete('/:id',authenticate,authorize('admin'),softDeleteProduct)


router.get('/search', searchProducts);
router.get('/filter/by', filterProducts);
router.get('/sort/by', getSortedProducts);
router.get('/related/:route', getRelatedProduct);
router.get('/by-category', getProductsByCategory);

router.get('/:route', getProductByRoute);


module.exports=router


