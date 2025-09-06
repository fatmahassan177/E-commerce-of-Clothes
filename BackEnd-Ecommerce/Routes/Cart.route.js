const express = require('express')
const router = express.Router();
const { authenticate } = require('../Middlewares/auth.middleware');
const { authorize } = require('../Middlewares/role.middleware');
const {AddToCart,UpdataCart,RemoveItem,AcceptPriceChanges,GetCart} = require('../Controllers/Cart.controller');

router.post('/',authenticate, authorize('user'), AddToCart);
router.put('/',authenticate, authorize('user'), UpdataCart);
router.put('/accept-prices',authenticate, authorize('user'),  AcceptPriceChanges);
router.delete('/:productId',authenticate, authorize('user'),RemoveItem);
router.get('/', authenticate, authorize('user'), GetCart);

module.exports = router;