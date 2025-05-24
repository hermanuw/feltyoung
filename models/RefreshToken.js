const db = require('../config/db');

module.exports = {
  // Simpan refresh token baru
  async create({token, user_id, expiryDate}) {
    const sql = `
      INSERT INTO refresh_tokens (token, user_id, expiryDate)
      VALUES (?, ?, FROM_UNIXTIME(? / 1000))
    `;
    const [result] = await db.promise().query(sql, [token, user_id, expiryDate]);
    return {
      id: result.insertId,
      token,
      user_id,
      expiryDate: new Date(expiryDate)
    };
  },
  // Cari refresh token berdasarkan ID
async findByTokenWithUser(token) {
  const sql = `
    SELECT rt.*, u.email, u.role
    FROM refresh_tokens rt
    JOIN users u ON rt.user_id = u.user_id
    WHERE rt.token = ?
  `;
  const [rows] = await db.promise().query(sql, [token]);
  return rows[0] || null;
},

  // Cari refresh token berdasarkan token string
  async findByToken(token) {
    const sql = `SELECT * FROM refresh_tokens WHERE token = ?`;
    const [rows] = await db.promise().query(sql, [token]);
    return rows[0] || null;
  },

  // Hapus refresh token berdasarkan ID
  async deleteById(id) {
    const sql = `DELETE FROM refresh_tokens WHERE id = ?`;
    await db.promise().query(sql, [id]);
  },

  // Hapus semua refresh token milik user
  async deleteByUserId(user_id) {
    const sql = `DELETE FROM refresh_tokens WHERE user_id = ?`;
    await db.promise().query(sql, [user_id]);
  }
};
