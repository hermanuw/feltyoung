const mysql = require("mysql2");
require("dotenv").config(); // Load env variables

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi ke database gagal:", err.message);
  } else {
    console.log("✅ Terhubung ke database MySQL");
  }
});

module.exports = db;
