const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const auth = require('../middleware/auth'); 
const upload = require('../middleware/upload');
const validateRequest = require('../middleware/validateRequest');
const postSchema = require('../validation/postValidation');
const slugSchema = require('../validation/slugValidation');

// Routes

// Public routes
router.get('/', postController.getAllPosts); // all posts with search/pagination
router.get('/:id', postController.getPostById); // single post by id or slug

// Protected routes (require login)
router.post(
  '/',
  auth, // include only if endpoint requires authentication
  upload.single('image'), // MUST run before validateRequest so req.body is populated
  validateRequest(postSchema),
  postController.createPost
);

router.put(
  '/:slug',
  auth, 
  upload.single('image'),
  validateRequest(postSchema, slugSchema),
  postController.updatePost
);

router.delete('/:slug',
  auth,
  postController.deletePost
);

module.exports = router;
