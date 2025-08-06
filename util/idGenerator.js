const db = require('../config/db');

// Fungsi bantu padding angka ke 3 digit
function pad(number, size = 4) {
  return number.toString().padStart(size, '0');
}

// Generator ID produk custom
async function generateID({
  tableName,
  tableId,
  prefix,
  categoryCode,
}) {
  if (!tableName || !tableId || !prefix) {
    throw new Error("tableName, tableId, and prefix are required");
  }

  const likePattern = categoryCode
    ? `${prefix}-${categoryCode}-%`
    : `${prefix}-%`;

  const [rows] = await db.promise().query(
    `
      SELECT COUNT(*) AS count
      FROM ${tableName}
      WHERE ${tableId} LIKE ?
    `,
    [likePattern]
  );

  const count = rows[0]?.count || 0;

  const sequence = pad(count + 1);
  const finalId = categoryCode
    ? `${prefix}-${categoryCode}-${sequence}`
    : `${prefix}-${sequence}`;

  return finalId;
}

module.exports = {
  generateID,
};