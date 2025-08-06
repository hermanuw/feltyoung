const db = require('../config/db');

// Fungsi bantu padding nomor: 3 -> 003
function pad(number, size = 3) {
  return number.toString().padStart(size, '0');
}

// Generator untuk produk
async function generateID(prefix = 'PRD', categoryCode = '') {
  const sql = `
    SELECT COUNT(*) AS count
    FROM products
    WHERE product_id LIKE ? AND DATE(created_at) = CURDATE()
  `;
  const [rows] = await db.promise().query(sql, [`${prefix}-${categoryCode}%`]);
  const count = rows[0]?.count || 0;

  const sequence = pad(count + 1); // urutan baru
  const finalId = categoryCode
    ? `${prefix}-${categoryCode}-${sequence}`
    : `${prefix}-${sequence}`;

  return finalId;
}

module.exports = {
  generateID,
};
