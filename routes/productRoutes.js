const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isAdmin = require("../middleware/isAdmin");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/multer");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/top-sellers", productController.getTopSellerProducts);
router.get("/similar", productController.getSimilarProducts);
router.get("/filter", productController.filterProducts);
router.get("/category/:category", productController.getByCategory);
router.get("/brand/:brand", productController.getByBrand);
router.get("/id/:id", productController.getById);

// User request produk (butuh login)
router.post(
  "/request",
  authenticate,
  upload,
  productController.createProductRequests
);
// Lihat semua permintaan produk user sendiri
router.get("/request/me", authenticate, productController.getRequestsByUserId);

router.get("/request", authenticate, isAdmin, productController.getAllRequests);

router.put(
  "/request/:request_id",
  authenticate,
  isAdmin,
  productController.updateStatusRequest
);

// Admin only routes (authenticated + role: admin)
router.put(
  "/variant/:variant_id/stock",
  authenticate,
  isAdmin,
  productController.updateVariantStock
);

// Batch update stok varian produk
router.put(
  "/:product_id/variants/stock",
  authenticate,
  isAdmin,
  productController.updateProductVariantsStock
);

router.post("/", authenticate, isAdmin, upload, productController.addProducts);
router.put(
  "/:id",
  authenticate,
  isAdmin,
  upload,
  productController.updateProducts
);

// Tambah varian baru
router.post(
  "/:product_id/variants",
  authenticate,
  isAdmin,
  productController.addVariant
);
router.delete("/:id", authenticate, isAdmin, productController.deleteProducts);

module.exports = router;
