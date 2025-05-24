const Cart = require('../models/cart');

// Tambah produk ke cart
async function addToCart(req, res) {
  try {
    const user_id = req.user.id; // dari middleware authenticate
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'product_id dan quantity valid diperlukan' });
    }

    const item = await Cart.addItem({ user_id, product_id, quantity });
    return res.status(201).json({ message: 'Produk berhasil ditambahkan ke cart', item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal menambahkan ke cart' });
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
    return res.status(500).json({ message: 'Gagal mengambil data cart' });
  }
}

// Update quantity produk di cart
async function updateCartItem(req, res) {
  try {
    const { cart_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity valid diperlukan' });
    }

    await Cart.updateQuantity(cart_id, quantity);
    return res.json({ message: 'Quantity cart berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mengupdate cart' });
  }
}

// Hapus item dari cart
async function removeCartItem(req, res) {
  try {
    const { cart_id } = req.params;
    await Cart.removeItem(cart_id);
    return res.json({ message: 'Item cart berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal menghapus item cart' });
  }
}

// Bersihkan semua cart user (opsional saat checkout)
async function clearCart(req, res) {
  try {
    const user_id = req.user.id;
    await Cart.clearCartByUser(user_id);
    return res.json({ message: 'Cart berhasil dibersihkan' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal membersihkan cart' });
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
