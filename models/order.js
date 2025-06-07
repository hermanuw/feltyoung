// models/order.js
const db = require("../config/db");

module.exports = {
  // Simpan data order baru ke tabel orders
  async createOrder(order) {
    const {
      order_id,
      user_id,
      order_date,
      status,
      total_amount,
      payment_method,
      shipping_address,
      recipient_name,
      recipient_phone,
    } = order;

    const sql = `
      INSERT INTO orders (
        order_id, user_id, order_date, status,
        total_amount, payment_method, shipping_address, recipient_name, recipient_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db
      .promise()
      .query(sql, [
        order_id,
        user_id,
        order_date,
        status,
        total_amount,
        payment_method,
        shipping_address,
        recipient_name,
        recipient_phone,
      ]);
  },

  // Tambah item produk ke tabel order_items
  async addOrderItem(item) {
    const sql = `
      INSERT INTO order_items (
        order_item_id, order_id, product_id, quantity, price, size
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db
      .promise()
      .query(sql, [
        item.order_item_id,
        item.order_id,
        item.product_id,
        item.quantity,
        item.price,
        item.size,
      ]);
  },

  // Update status order berdasarkan notifikasi Midtrans
  async updateStatus(order_id, status) {
    const sql = `UPDATE orders SET status = ? WHERE order_id = ?`;
    await db.promise().query(sql, [status, order_id]);
  },

  // Ambil semua order milik user
  async findOrdersByUserId(user_id) {
    const sql = `
      SELECT * FROM orders
      WHERE user_id = ?
      ORDER BY order_date DESC
    `;
    const [rows] = await db.promise().query(sql, [user_id]);
    return rows;
  },

  // Ambil satu order saja berdasarkan order_id
  async findOrderById(order_id) {
    const sql = `SELECT * FROM orders WHERE order_id = ?`;
    const [rows] = await db.promise().query(sql, [order_id]);
    return rows[0] || null;
  },

  // Ambil semua item dari 1 order tertentu
  async getOrderItems(order_id) {
    const sql = `SELECT * FROM order_items WHERE order_id = ?`;
    const [rows] = await db.promise().query(sql, [order_id]);
    return rows;
  },

  async updatePaymentMethod(order_id, payment_method) {
    const sql = `UPDATE orders SET payment_method = ? WHERE order_id = ?`;
    await db.promise().query(sql, [payment_method, order_id]);
  },
};
