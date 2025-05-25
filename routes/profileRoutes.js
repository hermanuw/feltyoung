const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController');

// Semua route butuh autentikasi
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.put('/profile/password', authenticate, userController.changePassword);
router.put('/profile/address', authenticate, userController.updateAddress);

module.exports = router;
