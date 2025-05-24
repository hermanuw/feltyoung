const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const validateRegister = require('../middleware/validateRegister');

// Rute autentikasi
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify-token/:token', authController.verifyToken);
router.post('/verify-email/:email', authController.verifyEmail);
router.post('/token/refresh', authController.refreshToken);
router.get('/whoami', authController.whoami);

// Export router, bukan fungsi satu per satu
module.exports = router;
