const express = require('express');
const router = express.Router();
const { requireAuth, loadUser } = require('../utils/authMiddleware');
const airtableController = require('../controllers/airtableController');

router.use(requireAuth, loadUser);

router.get('/bases', airtableController.listBases);

router.get('/bases/:baseId/tables', airtableController.listTables);

router.get('/bases/:baseId/tables/:tableId/fields', airtableController.listFields);

module.exports = router;
