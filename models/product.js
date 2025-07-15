const db = require("../config/db");

module.exports = {
  // Ambil semua produk
  async getAll() {
    const sql = `
    SELECT p.*, COALESCE(SUM(v.stock), 0) AS total_stock
    FROM products p
    LEFT JOIN product_variants v ON p.product_id = v.product_id
    GROUP BY p.product_id
    ORDER BY p.created_at DESC
  `;
    const [rows] = await db.promise().query(sql);
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
      is_top_seller,
    } = product;

    const sql = `
    INSERT INTO products (
      product_id, name, description, price, stock, category, image_url, created_at, brand, is_top_seller
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
  `;

    await db.promise().query(sql, [
      product_id,
      name,
      description,
      price,
      stock,
      category,
      image_url,
      brand,
      is_top_seller, // ini penting!
    ]);

    return { product_id };
  },

  // Perbarui produk
  async update(id, product) {
    const {
      name,
      description,
      price,
      category,
      image_url,
      brand,
      is_top_seller,
    } = product;

    const sql = `
    UPDATE products
    SET name = ?, description = ?, price = ?, category = ?, image_url = ?, brand = ?, is_top_seller = ?
    WHERE product_id = ?
  `;

    await db
      .promise()
      .query(sql, [
        name,
        description,
        price,
        category,
        image_url,
        brand,
        is_top_seller ?? 0,
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
    let sql = `SELECT * FROM products WHERE brand = ? AND LOWER(category) != 'requested'`;
    const params = [brand];
    if (sort === "low") {
      sql += " ORDER BY price ASC";
    } else if (sort === "high") {
      sql += " ORDER BY price DESC";
    } else if (sort === "new") {
      sql += " ORDER BY created_at DESC";
    }
    const [rows] = await db.promise().query(sql, params);
    return rows;
  },

  async getTopSellers() {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM products WHERE is_top_seller = TRUE AND category != 'Requested'"
      );
    return rows;
  },

  // Ambil produk berdasarkan kategori
  async getByCategory(category, sort) {
    let sql = `SELECT * FROM products WHERE category = ? AND LOWER(category) != 'requested'`;
    const params = [category];

    if (sort === "low") {
      sql += " ORDER BY price ASC";
    } else if (sort === "high") {
      sql += " ORDER BY price DESC";
    } else if (sort === "new") {
      sql += " ORDER BY created_at DESC";
    }

    const [rows] = await db.promise().query(sql, params);
    return rows;
  },

  async search(keyword) {
    const sql = `
    SELECT * FROM products
    WHERE LOWER (category) != 'requested'
      AND (name LIKE ? OR brand LIKE ?)
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

  // Fungsi untuk mendapatkan semua varian dari satu produk
  async getVariantsByProductId(product_id) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM product_variants WHERE product_id = ? ORDER BY size ASC",
        [product_id]
      );
    return rows;
  },

  // Fungsi tambah varian baru
  async addVariant(variant) {
    const { variant_id, product_id, size, stock } = variant;
    const sql = `
      INSERT INTO product_variants (variant_id, product_id, size, stock, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    await db.promise().query(sql, [variant_id, product_id, size, stock]);
    return { variant_id };
  },

  //update stok varian
  async updateVariantStock(variant_id, stock) {
    // Update stok varian dulu
    const sqlUpdateVariant = `
    UPDATE product_variants
    SET stock = ?, updated_at = NOW()
    WHERE variant_id = ?
  `;
    await db.promise().query(sqlUpdateVariant, [stock, variant_id]);

    // Cari product_id varian itu
    const sqlGetProductId = `
    SELECT product_id FROM product_variants WHERE variant_id = ?
  `;
    const [rows] = await db.promise().query(sqlGetProductId, [variant_id]);
    if (rows.length === 0) return;

    const product_id = rows[0].product_id;

    // Hitung total stok varian produk itu
    const sqlSumStock = `
    SELECT COALESCE(SUM(stock), 0) AS total_stock FROM product_variants WHERE product_id = ?
  `;
    const [sumRows] = await db.promise().query(sqlSumStock, [product_id]);
    const totalStock = sumRows[0].total_stock;

    // Update stok total produk
    const sqlUpdateProductStock = `
    UPDATE products SET stock = ? WHERE product_id = ?
  `;
    await db.promise().query(sqlUpdateProductStock, [totalStock, product_id]);
  },
  // Cek apakah variant_id ada di tabel product_variants
  async checkVariantExists(variant_id) {
    const [rows] = await db
      .promise()
      .query("SELECT variant_id FROM product_variants WHERE variant_id = ?", [
        variant_id,
      ]);
    return rows.length > 0;
  },
  // Ambil stok varian berdasarkan variant_id
  async getVariantStock(variant_id) {
    const [rows] = await db
      .promise()
      .query("SELECT stock FROM product_variants WHERE variant_id = ?", [
        variant_id,
      ]);
    return rows[0]?.stock || 0;
  },

  // Hapus varian berdasarkan variant_id
  async removeVariant(variant_id) {
    const sql = `DELETE FROM product_variants WHERE variant_id = ?`;
    await db.promise().query(sql, [variant_id]);
  },

  // Jika ingin hapus semua varian produk ketika hapus produk
  async removeVariantsByProductId(product_id) {
    const sql = `DELETE FROM product_variants WHERE product_id = ?`;
    await db.promise().query(sql, [product_id]);
  },

  async decreaseVariantStock(product_id, size, quantity) {
    const sql = `
    UPDATE product_variants
    SET stock = stock - ?
    WHERE product_id = ? AND size = ?
  `;
    await db.promise().query(sql, [quantity, product_id, size]);
  },

  async createRequest({
    request_id,
    user_id,
    name,
    brand,
    size,
    image_url,
    status,
    quantity,
    linked_product_id,
  }) {
    const sql = `
    INSERT INTO product_requests
    (request_id, user_id, name, brand, size, status, quantity, created_at, image_url, linked_product_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
  `;

    await db
      .promise()
      .query(sql, [
        request_id,
        user_id,
        name,
        brand,
        size,
        status,
        quantity,
        image_url,
        linked_product_id,
      ]);
  },

  async getRequestsByUserId(user_id) {
    const sql = `
      SELECT * FROM product_requests
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.promise().query(sql, [user_id]);
    return rows;
  },
  async getRequestById(request_id) {
    const sql = `SELECT * FROM product_requests WHERE request_id = ?`;
    const [rows] = await db.promise().query(sql, [request_id]);
    return rows[0];
  },

  // Ambil semua request untuk admin
  async getAllRequestsWithUser() {
    const [rows] = await db.promise().query(
      `SELECT pr.*, u.name AS user_name 
     FROM product_requests pr 
     JOIN users u ON pr.user_id = u.user_id 
     ORDER BY pr.created_at DESC`
    );
    return rows;
  },

  // Update status request oleh admin
  async updateRequestStatus(request_id, status, product_id) {
    const sql = `
    UPDATE product_requests
    SET status = ?, linked_product_id = ?
    WHERE request_id = ?
  `;
    await db.promise().query(sql, [status, product_id, request_id]);
  },

  async getRequestByLinkedProductId(product_id) {
    const sql = `SELECT * FROM product_requests WHERE linked_product_id = ?`;
    const [rows] = await db.promise().query(sql, [product_id]);
    return rows[0];
  },

  async updateStatusToOrdered(product_id, user_id) {
    const sql = `
    UPDATE product_requests
    SET status = 'ordered'
    WHERE linked_product_id = ? AND user_id = ?
  `;
    await db.promise().query(sql, [product_id, user_id]);
  },
  // Cek apakah produk sudah ada di catalog berdasarkan nama
  async findByName(name) {
    const cleanedName = name.replace(/\s+/g, " ").trim();

    // Query untuk cek nama produk tanpa spasi ganda dan case-insensitive
    const sql = `
      SELECT * FROM products 
      WHERE REPLACE(name, ' ', '') = REPLACE(?, ' ', '')
    `;
    const [rows] = await db.promise().query(sql, [cleanedName]);
    return rows[0] || null;
  },
};
