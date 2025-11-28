const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, loadUser } = require('../utils/authMiddleware');

router.get('/airtable/login', authController.initiateLogin);

router.get('/airtable/callback', authController.handleCallback);

router.get('/me', requireAuth, loadUser, authController.getCurrentUser);

router.post('/logout', authController.logout);

module.exports = router;
