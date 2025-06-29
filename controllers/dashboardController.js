const Dashboard = require("../models/dashboard");
const { get } = require("../routes/orderRoutes");

async function getTotalEarning(req, res) {
  try {
    const total = await Dashboard.getTotalEarning();
    res.json({ total });
  } catch (err) {
    console.error("Get total earning error:", err);
    res.status(500).json({ message: "Failed to fetch total earning" });
  }
}

async function getTotalOrder(req, res) {
  try {
    const count = await Dashboard.getTotalOrder();
    res.json({ count });
  } catch (err) {
    console.error("Get total order error:", err);
    res.status(500).json({ message: "Failed to fetch total order" });
  }
}

async function getMonthlyOrder(req, res) {
  try {
    const count = await Dashboard.getMonthlyOrderCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch monthly order" });
  }
}

async function getYearlyOrder(req, res) {
  try {
    const count = await Dashboard.getYearlyOrderCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch yearly order" });
  }
}

async function getUserStats(req, res) {
  try {
    const [verified, unverified] = await Promise.all([
      Dashboard.getVerifiedUserCount(),
      Dashboard.getUnverifiedUserCount(),
    ]);
    res.json({ verified, unverified });
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
}

async function getOrderChartData(req, res) {
  try {
    const [weekly, monthly] = await Promise.all([
      Dashboard.getOrderCountByWeekThisMonth(),
      Dashboard.getOrderCountByMonthThisYear(),
    ]);
    res.json({ weekly, monthly });
  } catch (err) {
    console.error("Chart data error:", err);
    res.status(500).json({ message: "Failed to get chart data" });
  }
}
async function getTopSellerProducts(req, res) {
  try {
    const products = await Dashboard.getTopSellers();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch top seller products" });
  }
}

module.exports = {
  getTotalEarning,
  getTotalOrder,
  getMonthlyOrder,
  getYearlyOrder,
  getOrderChartData,
  getUserStats,
  getTopSellerProducts,
};
