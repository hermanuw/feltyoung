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
    SELECT 
      o.order_id,
      o.order_date,
      o.status,
      o.total_amount,
      o.payment_method,
      o.shipping_address,

      oi.product_id,
      oi.quantity,
      oi.price,

      p.name AS product_name,
      p.image_url
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `;

    const [rows] = await db.promise().query(sql, [user_id]);

    // Kelompokkan item berdasarkan order_id
    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.order_id]) {
        grouped[row.order_id] = {
          order_id: row.order_id,
          order_date: row.order_date,
          status: row.status,
          total_amount: row.total_amount,
          payment_method: row.payment_method,
          shipping_address: row.shipping_address,
          items: [],
        };
      }

      grouped[row.order_id].items.push({
        product_id: row.product_id,
        name: row.product_name,
        quantity: row.quantity,
        price: row.price,
        image_url: row.image_url,
      });
    }

    // Kembalikan hasil sebagai array
    return Object.values(grouped);
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
