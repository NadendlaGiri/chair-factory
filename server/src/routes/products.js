const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getRelatedProducts, getTopProducts, importProducts } = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');
const activityLogger = require('../middlewares/activityLogger');

// Public
router.get('/', getProducts);
router.get('/analytics/top', getTopProducts);
router.get('/:slug/related', getRelatedProducts);
router.get('/:slug', getProduct);

// Admin protected
router.post('/import', authMiddleware, importProducts);
router.post('/', authMiddleware, activityLogger('Created Product'), createProduct);
router.put('/:id', authMiddleware, activityLogger('Updated Product'), updateProduct);
router.delete('/:id', authMiddleware, activityLogger('Deleted Product'), deleteProduct);

module.exports = router;
