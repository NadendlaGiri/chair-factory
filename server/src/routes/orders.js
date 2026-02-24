const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, getStats } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');

// Public: submit order request
router.post('/', createOrder);

// Admin protected
router.get('/stats', authMiddleware, getStats);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrder);
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
