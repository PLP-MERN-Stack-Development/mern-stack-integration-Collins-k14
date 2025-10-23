
const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const validateRequest = require('../middleware/validateRequest');
const postSchema = require('../validation/postValidation');
const slugSchema = require('../validation/slugValidation');

// GET posts

router.get('/', postController.getAllPosts);

router.get('/:slug', validateRequest(null, slugSchema), postController.getPostBySlug);

// POST
router.post('/', validateRequest(postSchema), postController.createPost);

// PUT 
router.put('/:slug', validateRequest(postSchema, slugSchema), postController.updatePost);

// DELETE 
router.delete('/:slug', validateRequest(null, slugSchema), postController.deletePost);

module.exports = router;
