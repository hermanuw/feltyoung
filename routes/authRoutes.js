const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");
// const validateRegister = require('../middleware/validateRegister');

// Rute autentikasi
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/verify-token/:token", authController.verifyToken);
router.post("/verify-email/:email", authController.verifyEmail);
router.post("/token/refresh", authController.refreshToken);
router.get("/whoami", authController.whoami);

module.exports = router;
