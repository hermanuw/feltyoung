// config/midtrans.js
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false, // Ganti ke true di production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

//Inisialisasi Midtrans CoreApi (cek status & notifikasi)
const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
  snap,
  coreApi,
};
