const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authenticate");
const isAdmin = require("../middleware/isAdmin");

router.post("/webhook", orderController.handleNotification);

// Semua endpoint butuh autentikasi
router.use(authenticate);

// 1. Buat order dan dapatkan token transaksi Midtrans
router.post("/", orderController.createOrder);

// 2. Ambil semua order milik user login
router.get("/", orderController.getUserOrders);
router.get("/admin/all", authenticate, isAdmin, orderController.getAllOrders);
// 3. Ambil detail order tertentu + item-nya
router.get("/:order_id", orderController.getOrderById);

// 4. Update status jadi selesai oleh pembeli
router.put("/:order_id/complete", orderController.completeOrder);

// 5. Admin mengubah status order (packing, shipped, done, cancelled)
router.put("/:order_id/status", isAdmin, orderController.updateOrderStatus);

// 6. Update nomor resi/tracking
router.put(
  "/:order_id/tracking",
  isAdmin,
  orderController.updateTrackingNumber
);

// 6. Cek status transaksi ke Midtrans (opsional tapi bagus untuk debugging)
router.get("/status/:order_id", orderController.getTransactionStatus);

// 7. Handle notifikasi webhook dari Midtrans

module.exports = router;
