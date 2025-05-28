const db = require("../config/db");

module.exports = {
  // Ambil semua produk
  async getAll() {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM products ORDER BY created_at DESC");
    return rows;
  },

  // Ambil produk berdasarkan ID
  async getById(id) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM products WHERE product_id = ?", [id]);
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
      image_url,
      brand,
    } = product;

    const sql = `
      INSERT INTO products (product_id, name, description, price, stock, category, image_url, created_at, brand)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;
    await db
      .promise()
      .query(sql, [
        product_id,
        name,
        description,
        price,
        stock,
        category,
        image_url,
        brand,
      ]);

    return { product_id };
  },

  // Perbarui produk
  async update(id, product) {
    const { name, description, price, stock, category, image_url, brand } =
      product;

    const sql = `
      UPDATE products
      SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ?, brand = ?
      WHERE product_id = ?
    `;
    await db
      .promise()
      .query(sql, [
        name,
        description,
        price,
        stock,
        category,
        image_url,
        brand,
        id,
      ]);
  },

  // Hapus produk
  async remove(id) {
    const sql = `DELETE FROM products WHERE product_id = ?`;
    await db.promise().query(sql, [id]);
  },

  // Ambil produk berdasarkan brand
  async getByBrand(brand, sort) {
    let sql = `SELECT * FROM products WHERE brand = ?`;
    const params = [brand];
    if (sort === "low") {
      sql += " ORDER BY price ASC";
    } else if (sort === "high") {
      sql += " ORDER BY price DESC";
    } else if (sort === "new") {
      sql += " ORDER BY created_at DESC"; // pastikan kolom ini ada, atau ganti jadi id
    }
    const [rows] = await db.promise().query(sql, params);
    return rows;
  },

  async getTopSellers() {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM products WHERE is_top_seller = TRUE");
    return rows;
  },

  // Ambil produk berdasarkan kategori
  async getByCategory(category, sort) {
    let sql = `SELECT * FROM products WHERE category = ?`;
    const params = [category];

    if (sort === "low") {
      sql += " ORDER BY price ASC";
    } else if (sort === "high") {
      sql += " ORDER BY price DESC";
    } else if (sort === "new") {
      sql += " ORDER BY created_at DESC"; // pastikan kolom ini ada, atau ganti jadi id
    }

    const [rows] = await db.promise().query(sql, params);
    return rows;
  },

  async search(keyword) {
    const sql = `
    SELECT * FROM products
    WHERE name LIKE ? OR brand LIKE ?
  `;
    const [rows] = await db
      .promise()
      .query(sql, [`%${keyword}%`, `%${keyword}%`]);
    return rows;
  },

  async filter(category, min, max, name, sort) {
    let sql = `SELECT * FROM products WHERE 1=1`;
    const params = [];

    if (name) {
      sql += ` AND name LIKE ?`;
      params.push(`%${name}%`);
    }
    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }

    if (min) {
      sql += ` AND price >= ?`;
      params.push(parseInt(min));
    }

    if (max) {
      sql += ` AND price <= ?`;
      params.push(parseInt(max));
    }
    if (sort === "low") sql += " ORDER BY price ASC";
    if (sort === "high") sql += " ORDER BY price DESC";
    if (sort === "new") sql += " ORDER BY created_at DESC";
    const [rows] = await db.promise().query(sql, params);
    return rows;
  },
  async getSimilarByName(nameBase) {
    const sql = `
    SELECT * FROM products
    WHERE name LIKE ? AND name <> ?
    ORDER BY created_at DESC
    LIMIT 8
  `;
    const [rows] = await db.promise().query(sql, [`${nameBase}%`, nameBase]);
    return rows;
  },
};
