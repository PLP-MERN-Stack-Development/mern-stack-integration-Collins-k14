const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const validateRequest = require('../middleware/validateRequest');
const postSchema = require('../validation/postValidation');
const slugSchema = require('../validation/slugValidation');
const upload = require('../middleware/upload');

// GET posts
router.get('/', postController.getAllPosts);
router.get('/:slug', validateRequest(null, slugSchema), postController.getPostBySlug);

// POST (Create Post with optional image upload)
router.post(
  '/',
  upload.single('featuredImage'),
  validateRequest(postSchema),
  postController.createPost
);

// PUT (Update Post with optional image upload)
router.put(
  '/:slug',
  upload.single('featuredImage'),
  validateRequest(postSchema, slugSchema),
  postController.updatePost
);

// DELETE
router.delete('/:slug', validateRequest(null, slugSchema), postController.deletePost);

module.exports = router;
