const express = require('express');
const router = express.Router();
const { getContent, upsertContent } = require('../controllers/contentController');
const authMiddleware = require('../middlewares/auth');

// Public: read all or by key
router.get('/', getContent);
router.get('/:key', getContent);

// Admin: upsert by key
router.put('/:key', authMiddleware, upsertContent);

module.exports = router;
