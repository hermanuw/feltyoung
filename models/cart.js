const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async addItem({ user_id, variant_id, quantity }) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM cart_items WHERE user_id = ? AND variant_id = ?", [
        user_id,
        variant_id,
      ]);

    if (rows.length > 0) {
      const newQty = rows[0].quantity + quantity;
      await db
        .promise()
        .query("UPDATE cart_items SET quantity = ? WHERE cart_id = ?", [
          newQty,
          rows[0].cart_id,
        ]);
      return {
        cart_id: rows[0].cart_id,
        user_id,
        variant_id,
        quantity: newQty,
      };
    } else {
      const cart_id = uuidv4();
      await db
        .promise()
        .query(
          "INSERT INTO cart_items (cart_id, user_id, variant_id, quantity) VALUES (?, ?, ?, ?)",
          [cart_id, user_id, variant_id, quantity]
        );
      return { cart_id, user_id, variant_id, quantity };
    }
  },

  async getItemsByUser(user_id) {
    const [rows] = await db.promise().query(
      `SELECT
        c.cart_id,
        c.quantity,
        v.variant_id,
        v.size,
        p.product_id,
        p.name,
        p.image_url,
        p.price
      FROM cart_items c
      JOIN product_variants v ON c.variant_id = v.variant_id
      JOIN products p ON v.product_id = p.product_id
      WHERE c.user_id = ?`,
      [user_id]
    );
    return rows;
  },

  async updateQuantity(cart_id, quantity) {
    await db
      .promise()
      .query("UPDATE cart_items SET quantity = ? WHERE cart_id = ?", [
        quantity,
        cart_id,
      ]);
  },

  async removeItem(cart_id) {
    await db
      .promise()
      .query("DELETE FROM cart_items WHERE cart_id = ?", [cart_id]);
  },

  async clearCartByUser(user_id) {
    await db
      .promise()
      .query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);
  },
};
