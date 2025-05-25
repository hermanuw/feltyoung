const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/multer');
const authenticate = require('../middleware/authenticate');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/top-sellers', productController.getTopSellerProducts);
router.get('/:category', productController.getByCategory);
router.get('/:id', productController.getById);
router.get('/brand/:brand', productController.getByBrand);

// Admin only routes (authenticated + role: admin)
router.post('/', authenticate, isAdmin, upload.single('image'), productController.addProducts);
router.put('/:id', authenticate ,isAdmin, upload.single('image'), productController.updateProducts);
router.delete('/:id', authenticate, isAdmin, productController.deleteProducts);

module.exports = router;
