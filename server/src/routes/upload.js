const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/auth');

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
};

// ---------------------------------------------------------------------------
// Cloudinary storage (production) vs disk storage (development)
// ---------------------------------------------------------------------------
let upload;

if (process.env.CLOUDINARY_CLOUD_NAME) {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const cloudStorage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'chair-factory',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
    });

    upload = multer({ storage: cloudStorage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });
} else {
    // Local disk storage (development)
    const diskStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '..', '..', 'uploads'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
    });
    upload = multer({ storage: diskStorage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });
}

// ---------------------------------------------------------------------------
router.post('/', authMiddleware, upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const urls = req.files.map(file => {
        // Cloudinary returns secure_url; disk returns a local path
        return file.path || `/uploads/${file.filename}`;
    });

    res.json({ urls });
});

module.exports = router;
