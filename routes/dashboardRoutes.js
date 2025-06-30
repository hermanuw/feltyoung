const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const isAdmin = require("../middleware/isAdmin");
const dashboardController = require("../controllers/dashboardController");

router.get(
  "/earning",
  authenticate,
  isAdmin,
  dashboardController.getTotalEarning
);
router.get("/orders", authenticate, isAdmin, dashboardController.getTotalOrder);
router.get(
  "/orders/monthly",
  authenticate,
  isAdmin,
  dashboardController.getMonthlyOrder
);
router.get(
  "/orders/yearly",
  authenticate,
  isAdmin,
  dashboardController.getYearlyOrder
);
router.get(
  "/orders/chart",
  authenticate,
  isAdmin,
  dashboardController.getOrderChartData
);

router.get("/users", authenticate, isAdmin, dashboardController.getUserStats);
router.get("/top-sellers", dashboardController.getTopSellerProducts);
router.get(
  "/growth",
  authenticate,
  isAdmin,
  dashboardController.getTotalGrowthByPeriod
);

module.exports = router;
