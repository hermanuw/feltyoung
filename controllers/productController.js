const { v4: uuidv4 } = require("uuid");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../config/r2");
const Product = require("../models/product");

// GET all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.getAll();
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
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
}

// CREATE new product
async function addProducts(req, res) {
  try {
    const { name, description, price, stock, category, brand } = req.body;

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

    const { name, price, stock, description, category, brand } = req.body;
    let image_url = existing.image_url; // default: tetap pakai gambar lama

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
};
