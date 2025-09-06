const express =require('express')
const  router=express.Router()
const {authenticate}=require('../Middlewares/auth.middleware')
const {authorize}=require('../Middlewares/role.middleware')
const { CreateOrder,getOrders,updateOrderStatus,cancelOrder,getPendingOrders,getAllOrdersForAdmin} = require('../Controllers/Order.controller');
const{getSaleReport}=require('../Controllers/report.controller')

router.post('/',authenticate,authorize('user'),CreateOrder);
router.get('/', authenticate,authorize('user'),getOrders);

router.put('/status/:orderId',authenticate,authorize('admin'),updateOrderStatus);
router.get('/pending',authenticate,authorize('admin'),getPendingOrders);
router.get('/all',authenticate,authorize('admin'),getAllOrdersForAdmin);
router.get('/report',authenticate,authorize('admin'),getSaleReport)
router.put('/:orderId',authenticate,authorize('user'),cancelOrder);
module.exports = router;
