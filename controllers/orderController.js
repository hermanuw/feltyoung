const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/order");
const snap = require("../config/midtrans");
const coreApi = require("../config/midtrans");
const crypto = require("crypto");
require("dotenv").config(); // Load env variables

async function getTransactionStatus(req, res) {
  const { order_id } = req.params; // Ambil order_id dari parameter URL

  try {
    // Panggil Midtrans API untuk mendapatkan status transaksi
    const statusResponse = await coreApi.transaction.status(order_id);

    // Cek apakah statusResponse valid dan memiliki transaction_status
    if (!statusResponse || !statusResponse.transaction_status) {
      return res
        .status(404)
        .json({
          message: "Transaction not found or invalid response from Midtrans",
        });
    }

    console.log("Transaction Status Response:", statusResponse); // Debugging log

    // Kirim status transaksi ke Postman atau client
    return res.status(200).json(statusResponse);
  } catch (err) {
    console.error("Error retrieving transaction status:", err);

    // Jika error berasal dari Midtrans, tampilkan error response dari API Midtrans
    if (err.response) {
      return res.status(500).json({
        message: `Error from Midtrans API: ${
          err.response.data.message || "Unknown error"
        }`,
      });
    }

    // Tangani error lain seperti koneksi jaringan
    return res
      .status(500)
      .json({ message: "Error retrieving transaction status" });
  }
}

// Buat order dan simpan ke database
async function createOrder(req, res) {
  const { total_amount, payment_method, shipping_address, items } = req.body;
  const order_id = uuidv4();
  const order_date = new Date();
  const user_id = req.user.id;

  // Validasi data utama
  if (
    !total_amount ||
    !payment_method ||
    !shipping_address ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Semua data wajib diisi dan items tidak boleh kosong" });
  }

  // Validasi setiap item
  for (const [i, item] of items.entries()) {
    if (
      !item.product_id ||
      typeof item.quantity !== "number" ||
      typeof item.price !== "number"
    ) {
      return res.status(400).json({ message: `Item ke-${i + 1} tidak valid` });
    }
    if (item.quantity <= 0 || item.price <= 0) {
      return res
        .status(400)
        .json({
          message: `Kuantitas dan harga item ke-${i + 1} harus lebih dari 0`,
        });
    }
  }

  try {
    // Simpan order utama
    await Order.createOrder({
      order_id,
      user_id,
      order_date,
      status: "pending",
      total_amount,
      payment_method,
      shipping_address,
    });

    // Simpan item-item order
    for (const item of items) {
      await Order.addOrderItem({
        order_item_id: uuidv4(),
        order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Buat transaksi Midtrans
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id,
        gross_amount: total_amount,
      },
      customer_details: {
        email: req.user.email,
        first_name: req.user.name,
      },
    });

    return res.status(201).json({
      message: "Order created",
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    return res.status(500).json({ message: "Gagal membuat order" });
  }
}

// Notifikasi webhook dari Midtrans

// Fungsi untuk verifikasi signature webhook dari Midtrans
function verifyMidtransSignature(payload, serverKey) {
  const signaturePayload =
    payload.order_id + payload.status_code + payload.gross_amount + serverKey;
  const signature = crypto
    .createHash("sha512")
    .update(signaturePayload)
    .digest("hex");
  return signature === payload.signature_key;
}

// Handle webhook notification dari Midtrans
async function handleNotification(req, res) {
  try {
    const body = req.body;

    // Verifikasi signature dengan serverKey dari environment
    if (!verifyMidtransSignature(body, process.env.MIDTRANS_SERVER_KEY)) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    const { order_id, transaction_status, payment_type } = body;

    let status = "pending"; // Default status
    if (transaction_status === "settlement") {
      status = "paid";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      status = "cancelled";
    } else if (transaction_status === "pending") {
      status = "pending";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "failure"
    ) {
      status = "cancelled";
    }

    // Update status order dan payment_method ke database
    await Order.updateStatus(order_id, status);
    await Order.updatePaymentMethod(order_id, payment_type);

    // Kirim response sukses
    return res.status(200).json({ message: "Notification handled" });
  } catch (err) {
    console.error("Notification Error:", err);
    return res.status(500).json({ message: "Failed to process notification" });
  }
}

// Ambil semua order milik user yang sedang login
async function getUserOrders(req, res) {
  try {
    const orders = await Order.findOrdersByUserId(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Gagal mengambil data order" });
  }
}

// Ambil detail order + item-nya
async function getOrderById(req, res) {
  const { order_id } = req.params;
  try {
    const order = await Order.findOrderById(order_id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    const items = await Order.getOrderItems(order_id);

    res.status(200).json({
      ...order,
      items,
    });
  } catch (err) {
    console.error("Get Order Error:", err);
    res.status(500).json({ message: "Gagal mengambil detail order" });
  }
}

// Pembeli menyelesaikan order (ubah status jadi done)
async function completeOrder(req, res) {
  const { order_id } = req.params;
  const user_id = req.user.id;

  try {
    const order = await Order.findOrderById(order_id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });
    if (order.user_id !== user_id)
      return res.status(403).json({ message: "Bukan pemilik order" });
    if (order.status !== "shipped")
      return res.status(400).json({ message: "Order belum dikirim" });

    await Order.updateStatus(order_id, "done");
    return res.status(200).json({ message: "Order selesai" });
  } catch (err) {
    console.error("Complete Order Error:", err);
    return res.status(500).json({ message: "Gagal menyelesaikan pesanan" });
  }
}

// Admin update status order (packing, shipped, done, cancelled)
async function updateOrderStatus(req, res) {
  const { order_id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ["packing", "shipped", "done", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  try {
    const order = await Order.findOrderById(order_id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    await Order.updateStatus(order_id, status);
    return res.status(200).json({ message: `Status diubah menjadi ${status}` });
  } catch (err) {
    console.error("Update Status Error:", err);
    return res.status(500).json({ message: "Gagal mengubah status order" });
  }
}

module.exports = {
  getTransactionStatus,
  createOrder,
  handleNotification,
  getUserOrders,
  getOrderById,
  completeOrder,
  updateOrderStatus,
};
