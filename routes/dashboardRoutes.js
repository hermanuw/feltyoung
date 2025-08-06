const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const dashboardController = require("../controllers/dashboardController");

router.get(
  "/earning",
  authenticate,
  isSuperAdmin,
  dashboardController.getTotalEarning
);
router.get("/orders", authenticate, isSuperAdmin, dashboardController.getTotalOrder);
router.get(
  "/orders/monthly",
  authenticate,
  isSuperAdmin,
  dashboardController.getMonthlyOrder
);
router.get(
  "/orders/yearly",
  authenticate,
  isSuperAdmin,
  dashboardController.getYearlyOrder
);
router.get(
  "/orders/chart",
  authenticate,
  isSuperAdmin,
  dashboardController.getOrderChartData
);

router.get("/users", authenticate, isSuperAdmin, dashboardController.getUserStats);
router.get("/top-sellers", dashboardController.getTopSellerProducts);
router.get(
  "/growth",
  authenticate,
  isSuperAdmin,
  dashboardController.getTotalGrowthByPeriod
);
router.get(
  "/top-sellers/period",
  authenticate,
  isSuperAdmin,
  dashboardController.getTopSellersByPeriod
);

module.exports = router;
