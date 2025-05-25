const db = require('../config/db'); // mysql2 with pool

module.exports = {
  // Cari user berdasarkan email
  async findByEmail(email) {
    const [rows] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Cari user berdasarkan username (jika login pakai username)
  async findByUsername(username) {
    const [rows] = await db.promise().query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  },

async setVerified(email) {
  const sql = `UPDATE users SET verified = true WHERE email = ?`;
  await db.promise().query(sql, [email]);
},

  // Cari user berdasarkan ID
  async findById(user_id) {
    const [rows] = await db.promise().query(
      'SELECT * FROM users WHERE user_id = ?',
      [user_id]
    );
    return rows[0] || null;
  },

  // Buat user baru
  async createUser(userData) {
    const {
      user_id,
      name,
      email,
      password, // gunakan password, bukan hashedPassword
      phone_number,
      address,
      role = 'user',
      verified = false,
    } = userData;

    const sql = `
      INSERT INTO users (user_id, name, email, password, phone_number, address, role, verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.promise().query(sql, [
      user_id,
      name,
      email,
      password,
      phone_number,
      address,
      role,
      verified,
    ]);

    return { user_id }; // kembalikan user_id agar bisa digunakan untuk JWT atau lainnya
  },

    // Ubah nama dan nomor telepon
  async updateProfile(user_id, { name, phone_number }) {
    const sql = `UPDATE users SET name = ?, phone_number = ? WHERE user_id = ?`;
    await db.promise().query(sql, [name, phone_number, user_id]);
  },

  // Ubah password
  async updatePassword(user_id, hashedPassword) {
    const sql = `UPDATE users SET password = ? WHERE user_id = ?`;
    await db.promise().query(sql, [hashedPassword, user_id]);
  },

  // Ubah atau tambah alamat
  async updateAddress(user_id, address) {
    const sql = `UPDATE users SET address = ? WHERE user_id = ?`;
    await db.promise().query(sql, [address, user_id]);
  }

};
