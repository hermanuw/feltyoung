const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // Tambah produk ke cart (user_id, product_id, quantity)
  async addItem({ user_id, product_id, quantity }) {
    // Cek apakah produk sudah ada di cart user
    const [rows] = await db.promise().query(
      'SELECT * FROM carts WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (rows.length > 0) {
      // Update qty jika sudah ada
      const newQty = rows[0].quantity + quantity;
      await db.promise().query(
        'UPDATE carts SET quantity = ? WHERE id = ?',
        [newQty, rows[0].id]
      );
      return { id: rows[0].id, user_id, product_id, quantity: newQty };
    } else {
      // Insert item baru
      const id = uuidv4();
      await db.promise().query(
        'INSERT INTO carts (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
        [id, user_id, product_id, quantity]
      );
      return { id, user_id, product_id, quantity };
    }
  },

  // Dapatkan semua item cart berdasarkan user_id
  async getItemsByUser(user_id) {
    const [rows] = await db.promise().query(
      `SELECT c.id, c.user_id, c.product_id, c.quantity, p.name, p.price, p.image_url
       FROM carts c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );
    return rows;
  },

  // Update jumlah produk di cart berdasarkan id cart item
  async updateQuantity(cart_id, quantity) {
    await db.promise().query(
      'UPDATE carts SET quantity = ? WHERE id = ?',
      [quantity, cart_id]
    );
  },

  // Hapus item cart berdasarkan id cart item
  async removeItem(cart_id) {
    await db.promise().query(
      'DELETE FROM carts WHERE id = ?',
      [cart_id]
    );
  },

  // Hapus semua cart user (misal saat checkout)
  async clearCartByUser(user_id) {
    await db.promise().query(
      'DELETE FROM carts WHERE user_id = ?',
      [user_id]
    );
  }
};
