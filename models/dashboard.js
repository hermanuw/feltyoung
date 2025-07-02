const db = require("../config/db");

module.exports = {
  async getTotalEarning() {
    const [rows] = await db.promise().query(`
      SELECT SUM(total_amount) AS total FROM orders
      WHERE status IN ('paid', 'done')
    `);
    return rows[0]?.total || 0;
  },
  async getTotalOrder() {
    const [rows] = await db.promise().query(`
    SELECT COUNT(*) AS count FROM orders
  `);
    return rows[0]?.count || 0;
  },
  async getMonthlyOrderCount() {
    const [rows] = await db.promise().query(`
    SELECT COUNT(*) AS count FROM orders
    WHERE MONTH(order_date) = MONTH(CURRENT_DATE())
    AND YEAR(order_date) = YEAR(CURRENT_DATE())
    AND status IN ('paid', 'packing', 'shipped', 'done')
  `);
    return rows[0]?.count || 0;
  },

  async getYearlyOrderCount() {
    const [rows] = await db.promise().query(`
    SELECT COUNT(*) AS count FROM orders
    WHERE YEAR(order_date) = YEAR(CURRENT_DATE())
    AND status IN ('paid', 'packing', 'shipped', 'done')
  `);
    return rows[0]?.count || 0;
  },
  // Total order tiap minggu dalam bulan ini (4 minggu)
  async getOrderCountByWeekThisMonth() {
    const sql = `
    SELECT
      WEEK(order_date, 1) - WEEK(DATE_SUB(order_date, INTERVAL DAY(order_date)-1 DAY), 1) + 1 AS week,
      COUNT(*) AS count
    FROM orders
    WHERE MONTH(order_date) = MONTH(CURRENT_DATE())
      AND YEAR(order_date) = YEAR(CURRENT_DATE())
      AND status IN ('paid', 'packing', 'shipped', 'done')
    GROUP BY week
    ORDER BY week
  `;
    const [rows] = await db.promise().query(sql);
    const result = Array(4).fill(0);
    rows.forEach((r) => {
      if (r.week >= 1 && r.week <= 4) result[r.week - 1] = r.count;
    });
    return result;
  },

  // Total order tiap bulan dalam tahun ini (12 bulan)
  async getOrderCountByMonthThisYear() {
    const sql = `
    SELECT MONTH(order_date) AS month, COUNT(*) AS count
    FROM orders
    WHERE YEAR(order_date) = YEAR(CURRENT_DATE())
      AND status IN ('paid', 'packing', 'shipped', 'done')
    GROUP BY MONTH(order_date)
    ORDER BY month
  `;
    const [rows] = await db.promise().query(sql);
    const result = Array(12).fill(0);
    rows.forEach((r) => {
      result[r.month - 1] = r.count;
    });
    return result;
  },

  async getVerifiedUserCount() {
    const [rows] = await db.promise().query(`
    SELECT COUNT(*) AS count FROM users
    WHERE verified = TRUE AND role = 'user'
  `);
    return rows[0]?.count || 0;
  },

  async getUnverifiedUserCount() {
    const [rows] = await db.promise().query(`
    SELECT COUNT(*) AS count FROM users
    WHERE verified = FALSE AND role = 'user'
  `);
    return rows[0]?.count || 0;
  },
  async getTopSellers(limit = 5) {
    const sql = `
    SELECT p.name, COUNT(oi.product_id) AS total_sold
    FROM order_items oi
    JOIN products p ON p.product_id = oi.product_id
    GROUP BY oi.product_id
    ORDER BY total_sold DESC
    LIMIT ?
  `;
    const [rows] = await db.promise().query(sql, [limit]);
    return rows;
  },

  async getWeeklyIncome() {
    const sql = `
    SELECT
      WEEK(order_date, 1) - WEEK(DATE_SUB(order_date, INTERVAL DAY(order_date)-1 DAY), 1) + 1 AS week,
      SUM(total_amount) AS income
    FROM orders
    WHERE MONTH(order_date) = MONTH(CURRENT_DATE())
      AND YEAR(order_date) = YEAR(CURRENT_DATE())
      AND status IN ('paid', 'done')
    GROUP BY week
    ORDER BY week
  `;
    const [rows] = await db.promise().query(sql);
    const result = Array(4).fill(0);
    rows.forEach((row) => {
      if (row.week >= 1 && row.week <= 4) result[row.week - 1] = row.income;
    });
    return result;
  },
  async getDailyIncomeThisWeek() {
    const sql = `
    SELECT 
      day_index,
      day_name,
      SUM(income) AS income
    FROM (
      SELECT 
        DAYOFWEEK(order_date) AS day_index,
        CASE DAYOFWEEK(order_date)
          WHEN 1 THEN 'Sunday'
          WHEN 2 THEN 'Monday'
          WHEN 3 THEN 'Tuesday'
          WHEN 4 THEN 'Wednesday'
          WHEN 5 THEN 'Thursday'
          WHEN 6 THEN 'Friday'
          WHEN 7 THEN 'Saturday'
        END AS day_name,
        total_amount AS income
      FROM orders
      WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
        AND status IN ('paid', 'packing', 'shipped','done')
    ) AS sub
    GROUP BY day_index, day_name
    ORDER BY day_index
  `;
    const [rows] = await db.promise().query(sql);

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const result = days.map((day) => {
      const found = rows.find((row) => row.day_name === day);
      return found ? found.income : 0;
    });

    return result;
  },

  async getMonthlyIncomeThisYear() {
    const sql = `
    SELECT MONTH(order_date) AS month, SUM(total_amount) AS income
    FROM orders
    WHERE YEAR(order_date) = YEAR(CURRENT_DATE())
      AND status IN ('paid', 'done')
    GROUP BY month ORDER BY month
  `;
    const [rows] = await db.promise().query(sql);
    const result = Array(12).fill(0);
    rows.forEach((row) => {
      result[row.month - 1] = row.income;
    });
    return result;
  },
};
