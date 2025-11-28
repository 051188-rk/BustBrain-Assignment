const express = require('express');
const router = express.Router();
const { requireAuth, loadUser, requireOwnership } = require('../utils/authMiddleware');
const formController = require('../controllers/formController');
const responseController = require('../controllers/responseController');

router.post('/', requireAuth, loadUser, formController.createForm);

router.get('/', requireAuth, loadUser, formController.listUserForms);

router.get('/:formId', formController.getForm);

router.put('/:formId', requireAuth, loadUser, requireOwnership('Form', 'formId'), formController.updateForm);

router.delete('/:formId', requireAuth, loadUser, requireOwnership('Form', 'formId'), formController.deleteForm);

router.post('/:formId/responses', responseController.submitResponse);

router.get('/:formId/responses', requireAuth, loadUser, requireOwnership('Form', 'formId'), responseController.listResponses);

module.exports = router;
