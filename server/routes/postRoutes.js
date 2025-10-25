const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const upload = require('../middleware/upload');
const validateRequest = require('../middleware/validateRequest');
const postSchema = require('../validation/postValidation');
const slugSchema = require('../validation/slugValidation');
const auth = require('../middleware/auth'); // <--- middleware to protect routes

// Routes

// Public routes
router.get('/', postController.getAllPosts); // all posts with search/pagination
router.get('/:id', postController.getPostById); // single post by id or slug

// Protected routes (require login)
router.post(
  '/',
  auth, // <--- user must be logged in
  upload.single('image'),
  validateRequest(postSchema),
  postController.createPost
);

// If you implement update/delete later:
router.put(
  '/:slug',
  auth, // must be author
  upload.single('image'),
  validateRequest(postSchema, slugSchema),
  postController.updatePost
);

router.delete('/:slug',
  auth,
  postController.deletePost
);

module.exports = router;
