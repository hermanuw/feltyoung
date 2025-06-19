const multer = require("multer");
const storage = multer.memoryStorage(); // Menyimpan file di memori
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batasi ukuran file hingga 5MB
  fileFilter: (req, file, cb) => {
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/avif",
    ];
    if (validImageTypes.includes(file.mimetype)) {
      cb(null, true); // File valid
    } else {
      cb(
        new Error("Only image files (jpg, jpeg, png, gif, avif) are allowed"),
        false
      ); // Menolak file yang tidak valid
    }
  },
}).single("image"); // "image" adalah field yang dikirimkan oleh form-data

module.exports = upload;
