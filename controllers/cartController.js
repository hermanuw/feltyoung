const Cart = require("../models/cart");
const Product = require("../models/product");
// Tambah produk ke cart
async function addToCart(req, res) {
  try {
    const user_id = req.user.id;
    const { variant_id, quantity } = req.body;

    if (!variant_id || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ message: "variant_id dan quantity wajib diisi" });
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return res
        .status(400)
        .json({ message: "Quantity harus bilangan bulat antara 1 dan 10" });
    }

    // Validasi variant_id ada
    const variantExists = await Product.checkVariantExists(variant_id);
    if (!variantExists) {
      return res.status(404).json({ message: "Variant tidak ditemukan" });
    }

    // Ambil stok varian
    const stock = await Product.getVariantStock(variant_id);

    // Hitung quantity total jika item sudah ada di cart
    const items = await Cart.getItemsByUser(user_id);
    const existing = items.find((i) => i.variant_id === variant_id);
    const totalRequested = existing ? existing.quantity + quantity : quantity;

    if (totalRequested > stock) {
      return res.status(400).json({
        message: `Stok hanya tersedia ${stock} item untuk varian ini`,
      });
    }

    const item = await Cart.addItem({ user_id, variant_id, quantity });
    return res
      .status(201)
      .json({ message: "Produk berhasil ditambahkan ke cart", item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Gagal menambahkan ke cart" });
  }
}

// Lihat semua item cart user
async function getCart(req, res) {
  try {
    const user_id = req.user.id;
    const items = await Cart.getItemsByUser(user_id);
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Gagal mengambil data cart" });
  }
}

async function updateCartItem(req, res) {
  try {
    const { cart_id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    // Validasi quantity
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return res
        .status(400)
        .json({ message: "Minimal Quantity > 0 and Maximal Quantity <= 10" });
    }

    // Ambil semua item cart user
    const items = await Cart.getItemsByUser(user_id);
    const item = items.find((i) => i.cart_id === cart_id);
    if (!item) {
      return res
        .status(403)
        .json({ message: "Item tidak ditemukan atau bukan milik Anda" });
    }

    // Ambil stok varian dari database
    const stock = await Product.getVariantStock(item.variant_id);

    if (quantity > stock) {
      return res.status(400).json({
        message: `Stok varian hanya tersedia ${stock}, tidak bisa update ke ${quantity}`,
      });
    }

    await Cart.updateQuantity(cart_id, quantity);
    return res.json({ message: "Quantity cart berhasil diperbarui" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Gagal mengupdate cart" });
  }
}

// Hapus item dari cart
async function removeCartItem(req, res) {
  try {
    const { cart_id } = req.params;
    const user_id = req.user.id;

    // Validasi cart_id milik user
    const items = await Cart.getItemsByUser(user_id);
    const item = items.find((i) => i.cart_id === cart_id);
    if (!item) {
      return res
        .status(403)
        .json({ message: "Item tidak ditemukan atau bukan milik Anda" });
    }

    await Cart.removeItem(cart_id);
    return res.json({ message: "Item cart berhasil dihapus" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Gagal menghapus item cart" });
  }
}

// Bersihkan semua cart user (opsional saat checkout)
async function clearCart(req, res) {
  try {
    const user_id = req.user.id;
    await Cart.clearCartByUser(user_id);
    return res.json({ message: "Cart berhasil dibersihkan" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Gagal membersihkan cart" });
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
