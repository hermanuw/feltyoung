const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const isAdmin = require('../middleware/isAdmin');
const orderController = require('../controllers/orderController');
const order = require('../models/order');

// Endpoint untuk membuat order (harus login)
router.post('/', authenticate, orderController.createOrder);

// Endpoint melihat semua order milik user (harus login)
router.get('/', authenticate, orderController.getUserOrders);

// Endpoint melihat detail order + item-nya (harus login)
router.get('/:order_id', authenticate, orderController.getOrderById);

// Endpoint pembeli menyelesaikan order (ubah status jadi done, harus login)
router.put('/:order_id/complete', authenticate, orderController.completeOrder);

// Endpoint notifikasi Midtrans (webhook, tanpa autentikasi)
router.post('/midtrans-notification', orderController.handleNotification);

router.get('/transaction-status/:order_id', orderController.getTransactionStatus);

// Endpoint admin update status order (harus login dan admin)
router.put('/admin/orders/:order_id/status', authenticate, isAdmin, orderController.updateOrderStatus);

module.exports = router;
