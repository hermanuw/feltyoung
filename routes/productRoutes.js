const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multer");
const authenticate = require("../middleware/authenticate");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/top-sellers", productController.getTopSellerProducts);
router.get("/similar", productController.getSimilarProducts);
router.get("/filter", productController.filterProducts);
router.get("/category/:category", productController.getByCategory);
router.get("/brand/:brand", productController.getByBrand);
router.get("/id/:id", productController.getById);

// Admin only routes (authenticated + role: admin)
router.put(
  "/variant/:variant_id/stock",
  authenticate,
  isAdmin,
  productController.updateVariantStock
);

// Batch update stok varian produk (opsional)
router.put(
  "/:product_id/variants/stock",
  authenticate,
  isAdmin,
  productController.updateProductVariantsStock
);

router.post(
  "/",
  authenticate,
  isAdmin,
  upload.single("image"),
  productController.addProducts
);
router.put(
  "/:id",
  authenticate,
  isAdmin,
  upload.single("image"),
  productController.updateProducts
);
// Tambah varian baru (admin only)
router.post(
  "/:product_id/variants",
  authenticate,
  isAdmin,
  productController.addVariant
);
router.delete("/:id", authenticate, isAdmin, productController.deleteProducts);

module.exports = router;
