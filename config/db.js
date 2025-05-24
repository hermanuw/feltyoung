const mysql = require('mysql2');
require('dotenv').config(); // Load env variables

const db = mysql.createConnection({
  host     : process.env.DB_HOST,
  port     : process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('❌ Koneksi ke database gagal:', err.message);
  } else {
    console.log('✅ Terhubung ke database MySQL');
  }
});

module.exports = db;
