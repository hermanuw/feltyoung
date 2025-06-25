const { v4: uuidv4 } = require("uuid");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../config/r2");
const Product = require("../models/product");
const upload = require("../middleware/multer");
// GET all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.getAll(); // sudah include total_stock
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}

// GET product by ID
async function getById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Validasi khusus untuk produk request
    if (product.category === "request") {
      const request = await Product.getRequestByLinkedProductId(id);
      if (!request || request.user_id !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You are not allowed to view this product" });
      }
    }
    // Ambil varian produk
    const variants = await Product.getVariantsByProductId(id);

    // Hitung total stok varian (atau ambil dari kolom total_stock kalau ada di produk)
    // Kalau model getById belum include total_stock, kamu bisa hitung manual:
    const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);

    return res.json({ ...product, variants, total_stock: totalStock });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
}

// CREATE new product
async function addProducts(req, res) {
  try {
    const { name, description, price, stock, category, brand, is_top_seller } =
      req.body;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload ke Cloudflare R2
    const fileName = `${uuidv4()}-${file.originalname}`;
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await r2.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://pub-${process.env.R2_PUBLIC_HASH}.r2.dev/${fileName}`;

    // Simpan produk ke database
    const product_id = uuidv4();
    await Product.create({
      product_id,
      name,
      description,
      price,
      stock,
      category,
      image_url: imageUrl,
      brand,
      is_top_seller: Number(is_top_seller),
    });

    return res.status(201).json({
      message: "Product created successfully",
      product_id,
      image_url: imageUrl,
    });
  } catch (err) {
    console.error("Add product failed:", err);
    return res.status(500).json({ message: "Failed to add product" });
  }
}

// UPDATE existing product
async function updateProducts(req, res) {
  try {
    const { id } = req.params;
    const existing = await Product.getById(id);
    if (!existing)
      return res.status(404).json({ message: "Product not found" });

    const { name, price, stock, description, category, brand, is_top_seller } =
      req.body;
    let image_url = existing.image_url;

    // Jika file gambar dikirim, upload ke Cloudflare R2
    if (req.file) {
      const fileName = `${uuidv4()}-${req.file.originalname}`;
      const uploadParams = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await r2.send(new PutObjectCommand(uploadParams));

      image_url = `https://pub-${process.env.R2_PUBLIC_HASH}.r2.dev/${fileName}`;
    }

    await Product.update(id, {
      name,
      price,
      stock,
      description,
      category,
      image_url,
      brand,
      is_top_seller: Number(is_top_seller),
    });

    return res.json({ message: "Product updated" });
  } catch (err) {
    console.error("Update failed:", err);
    return res.status(500).json({ message: "Failed to update product" });
  }
}

// DELETE product
async function deleteProducts(req, res) {
  try {
    const { id } = req.params;
    const existing = await Product.getById(id);
    if (!existing)
      return res.status(404).json({ message: "Product not found" });

    // Ambil nama file dari URL R2 (karena Key = nama file)
    const imageUrl = existing.image_url;
    const regex = new RegExp(`${process.env.R2_BUCKET_NAME}/(.+)$`);
    const match = imageUrl.match(regex);
    const imageKey = match ? match[1] : null;

    if (imageKey) {
      const deleteParams = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: imageKey,
      };
      await r2.send(new DeleteObjectCommand(deleteParams));
    }

    await Product.remove(id);
    return res.json({ message: "Product deleted, including image if present" });
  } catch (err) {
    console.error("Delete product failed:", err);
    return res.status(500).json({ message: "Failed to delete product" });
  }
}

async function getByBrand(req, res) {
  const { brand } = req.params;
  const { sort } = req.query;

  try {
    const products = await Product.getByBrand(brand, sort);
    return res.json(products);
  } catch (err) {
    console.error("Get by brand failed:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch products by brand" });
  }
}
async function getTopSellerProducts(req, res) {
  try {
    const products = await Product.getTopSellers();
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to fetch top seller products" });
  }
}

async function getByCategory(req, res) {
  const { category } = req.params;
  const { sort } = req.query;
  try {
    const products = await Product.getByCategory(category, sort);
    return res.json(products);
  } catch (err) {
    console.error("Get by category failed:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch products by category" });
  }
}

async function searchProducts(req, res) {
  const keyword = req.query.keyword?.trim() || "";

  try {
    const products = await Product.search(keyword);
    return res.json(products);
  } catch (err) {
    console.error("Search products failed:", err);
    return res.status(500).json({ message: "Failed to search products" });
  }
}

async function filterProducts(req, res) {
  const { category, min, max, name, sort } = req.query;

  try {
    const products = await Product.filter(category, min, max, name, sort);
    res.json(products);
  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ message: "Failed to filter products" });
  }
}

async function getSimilarProducts(req, res) {
  const { productName } = req.query;

  if (!productName) {
    return res.status(400).json({ message: "Missing productName parameter" });
  }

  // Contoh ambil produk yang nama mengandung kata kunci, tapi bukan produk exact sama
  try {
    // misal kita cari produk yang namanya LIKE 'productName%' tapi exclude produk yg persis sama
    const products = await Product.getSimilarByName(productName);
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to fetch similar products" });
  }
}

async function updateVariantStock(req, res) {
  try {
    const { variant_id } = req.params;
    const { stock } = req.body;

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({ message: "Invalid stock value" });
    }

    await Product.updateVariantStock(variant_id, stock);

    return res.json({ message: "Variant stock updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update variant stock" });
  }
}

async function updateProductVariantsStock(req, res) {
  try {
    const { product_id } = req.params;
    const { variants } = req.body;

    if (!variants || !Array.isArray(variants)) {
      return res.status(400).json({ message: "Variants data required" });
    }

    for (const variant of variants) {
      if (!variant.variant_id || typeof variant.stock !== "number") {
        return res.status(400).json({ message: "Invalid variant format" });
      }
      await Product.updateVariantStock(variant.variant_id, variant.stock);
    }

    return res.json({ message: "Variants stock updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update variants stock" });
  }
}

async function addVariant(req, res) {
  try {
    const { product_id } = req.params;
    const { size, stock } = req.body;

    if (!size || typeof stock !== "number") {
      return res.status(400).json({ message: "Size and stock are required" });
    }

    const variant_id = uuidv4();

    await Product.addVariant({
      variant_id,
      product_id,
      size,
      stock,
    });

    // Update stok total produk
    await Product.updateVariantStock(variant_id, stock);

    return res.status(201).json({ message: "Variant added", variant_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add variant" });
  }
}

async function createProductRequests(req, res) {
  const { name, brand, size } = req.body;
  const user_id = req.user.id;

  // Validasi data
  if (!name || !brand || !size || !user_id) {
    return res
      .status(400)
      .json({ message: "Name, brand, size, and user_id are required" });
  }

  // Gunakan multer untuk menangani file upload
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res
        .status(400)
        .json({ message: err.message || "File size must be less than 5MB" });
    }

    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileName = `${uuidv4()}-${file.originalname}`; // Membuat nama file unik
      const uploadParams = {
        Bucket: process.env.R2_BUCKET_NAME, // Nama bucket R2
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // Upload ke Cloudflare R2
      await r2.send(new PutObjectCommand(uploadParams));

      const imageUrl = `https://pub-${process.env.R2_PUBLIC_HASH}.r2.dev/${fileName}`;
      console.log("Generated Image URL:", imageUrl);

      // Simpan data produk request ke database
      const request_id = uuidv4();
      await Product.createRequest({
        request_id,
        user_id, // Pastikan user_id diteruskan dengan benar
        name,
        brand,
        size,
        status: "requested",
        image_url: imageUrl, // Menyimpan URL gambar ke database
      });

      return res.status(201).json({
        message: "Product request created successfully",
        request_id,
        image_url: imageUrl, // Kembalikan URL gambar
      });
    } catch (err) {
      console.error("Error processing request:", err);
      return res
        .status(500)
        .json({ message: "Failed to create product request" });
    }
  });
}

async function getRequestsByUserId(req, res) {
  try {
    const user_id = req.user.id;
    const requests = await Product.getRequestsByUserId(user_id);
    return res.json(requests);
  } catch (err) {
    console.error("Get user request error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch product requests" });
  }
}

async function getAllRequests(req, res) {
  try {
    const requests = await Product.getAllRequestsWithUser();
    return res.json(requests);
  } catch (err) {
    console.error("Get all requests error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch all product requests" });
  }
}
// Admin: update status permintaan produk
async function updateStatusRequest(req, res) {
  const { request_id } = req.params;
  const { status } = req.body;

  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const request = await Product.getRequestById(request_id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (status === "accepted") {
      const product_id = uuidv4();

      await Product.create({
        product_id,
        name: request.name,
        brand: request.brand,
        description,
        price,
        stock,
        category,
        image_url: request.image_url,
      });

      await Product.updateRequestStatus(request_id, status, product_id);
    } else {
      // declined: hanya update status, product_id null
      await Product.updateRequestStatus(request_id, status, null);
    }

    res.json({ message: `Status updated to ${status}` });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update request status" });
  }
}

module.exports = {
  getAllProducts,
  getById,
  addProducts,
  updateProducts,
  deleteProducts,
  getByBrand,
  getTopSellerProducts,
  getByCategory,
  searchProducts,
  filterProducts,
  getSimilarProducts,
  addVariant,
  updateVariantStock,
  updateProductVariantsStock,
  createProductRequests,
  getRequestsByUserId,
  getAllRequests,
  updateStatusRequest,
};
