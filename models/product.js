const db = require('../config/db');

module.exports = {
  // Ambil semua produk
  async getAll() {
    const [rows] = await db.promise().query('SELECT * FROM products ORDER BY created_at DESC');
    return rows;
  },

  // Ambil produk berdasarkan ID
  async getById(id) {
    const [rows] = await db.promise().query('SELECT * FROM products WHERE product_id = ?', [id]);
    return rows[0] || null;
  },

  // Tambah produk baru
  async create(product) {
    const {
      product_id,
      name,
      description,
      price,
      stock,
      category,
      image_url
    } = product;

    const sql = `
      INSERT INTO products (product_id, name, description, price, stock, category, image_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.promise().query(sql, [
      product_id,
      name,
      description,
      price,
      stock,
      category,
      image_url
    ]);

    return { product_id };
  },

  // Perbarui produk
  async update(id, product) {
    const {
      name,
      description,
      price,
      stock,
      category,
      image_url
    } = product;

    const sql = `
      UPDATE products
      SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ?
      WHERE product_id = ?
    `;
    await db.promise().query(sql, [
      name,
      description,
      price,
      stock,
      category,
      image_url,
      id
    ]);
  },

  // Hapus produk
  async remove(id) {
    const sql = `DELETE FROM products WHERE product_id = ?`;
    await db.promise().query(sql, [id]);
  }
};
