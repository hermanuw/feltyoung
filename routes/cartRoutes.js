const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

// Semua route harus user login
router.use(authenticate);

// Tambah produk ke cart
router.post('/', cartController.addToCart);

// Dapatkan isi cart user
router.get('/', cartController.getCart);

// Update quantity produk di cart
router.put('/:cart_id', cartController.updateCartItem);

// Hapus item dari cart
router.delete('/:cart_id', cartController.removeCartItem);

// Bersihkan semua cart user (opsional)
router.delete('/', cartController.clearCart);

module.exports = router;
