// categoryRoutes
const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const validateRequest = require('../middleware/validateRequest');
const categorySchema = require('../validation/categoryValidation');

// GET categories
router.get('/', categoryController.getAllCategories);

// POST categories
router.post('/', validateRequest(categorySchema), categoryController.createCategory);

module.exports = router;
