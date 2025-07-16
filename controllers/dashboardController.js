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
async function getTotalGrowthByPeriod(req, res) {
  try {
    const { period } = req.query;
    let result;

    if (period === "daily") {
      result = await Dashboard.getDailyIncomeThisWeek();
    } else if (period === "weekly") {
      result = await Dashboard.getWeeklyIncome(); // W1–W4
    } else {
      result = await Dashboard.getMonthlyIncomeThisYear(); // Jan–Dec
    }

    res.json({ data: result });
  } catch (err) {
    console.error("Total growth error:", err);
    res.status(500).json({ message: "Failed to fetch growth data" });
  }
}
// Ambil produk terlaris berdasarkan waktu
async function getTopSellersByPeriod(req, res) {
  const { period } = req.query;

  try {
    let result = [];
    if (period === "today") {
      result = await Dashboard.getTopSellersToday();
    } else if (period === "month") {
      result = await Dashboard.getTopSellersThisMonth();
    } else if (period === "year") {
      result = await Dashboard.getTopSellersThisYear();
    } else {
      return res.status(400).json({ message: "Invalid period" });
    }

    return res.json(result);
  } catch (err) {
    console.error("Top sellers by period error:", err);
    return res.status(500).json({ message: "Failed to fetch top sellers" });
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
  getTotalGrowthByPeriod,
  getTopSellersByPeriod,
};
