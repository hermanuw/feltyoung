const multer = require('multer');
const storage = multer.memoryStorage(); // untuk upload ke R2, simpan di memori dulu
const upload = multer({ storage });
module.exports = upload;
