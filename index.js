const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware bawaan
app.use(cors(
  origin = 'https://localhost:5173'
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use(express.json())


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
