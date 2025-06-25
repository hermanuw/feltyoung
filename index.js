const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const multer = require("multer"); // Impor Multer untuk mengakses MulterError
const bodyParser = require("body-parser");

// Middleware bawaan
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // hanya kalau kamu pakai cookie
  })
);
// Middleware ini untuk memparsing JSON dan URL-encoded data.
// Mereka tidak akan mengganggu Multer untuk multipart/form-data.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes"); // Pastikan path ini benar jika productRoutes Anda ada di folder middleware
const orderRoutes = require("./routes/orderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", profileRoutes);
app.use("/api/cart", cartRoutes);

// Middleware penanganan error Multer (PENTING!)
// Ini harus ditempatkan setelah semua rute Anda agar dapat menangkap error yang berasal dari Multer.
app.use((err, req, res, next) => {
  // Jika error adalah instance dari MulterError, tangani secara spesifik
  if (err instanceof multer.MulterError) {
    console.error("Multer Error:", err); // Log error Multer untuk debugging
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Ukuran file terlalu besar. Maksimal 5MB." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message:
          "Nama bidang file tidak cocok atau terlalu banyak file diunggah.",
      });
    }
    // Untuk error Multer lainnya (termasuk "Unexpected end of form")
    return res
      .status(400)
      .json({ message: `Kesalahan unggah file: ${err.message}` });
  } else if (err) {
    // Untuk error lain yang tidak terkait Multer
    console.error("General Error:", err); // Log error umum
    return res
      .status(500)
      .json({ message: err.message || "Terjadi kesalahan server internal." });
  }
  next(); // Lanjutkan ke middleware berikutnya jika tidak ada error
});

// 404 handler (untuk rute yang tidak ditemukan)
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
