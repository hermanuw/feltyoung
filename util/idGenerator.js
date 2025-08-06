const db = require('../config/db');

// Fungsi bantu padding angka ke 3 digit
function pad(number, size = 4) {
  return number.toString().padStart(size, '0');
}

// Generator ID produk custom
async function generateID(prefix = 'PRD', categoryCode = '') {
  const sql = `
    SELECT COUNT(*) AS count
    FROM products
    WHERE product_id LIKE ?
  `;

  const likePattern = categoryCode
    ? `${prefix}-${categoryCode}-%`
    : `${prefix}-%`;

  const [rows] = await db.promise().query(sql, [likePattern]);
  const count = rows[0]?.count || 0;

  const sequence = pad(count + 1); // urutan: 001, 002, dst
  const finalId = categoryCode
    ? `${prefix}-${categoryCode}-${sequence}`
    : `${prefix}-${sequence}`;

  return finalId;
}

module.exports = {
  generateID,
};