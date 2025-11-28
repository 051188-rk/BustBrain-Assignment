const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/airtable', webhookController.handleAirtableWebhook);

module.exports = router;
