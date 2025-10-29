const Post = require('../models/Post');
const Category = require('../models/categories');

// Get all posts with search + pagination + category filter
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || null;
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      const cat = await Category.findOne({ slug: category }) || await Category.findById(category);
      if (cat) filter.category = cat._id;
    }

    const posts = await Post.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create new post
exports.createPost = async (req, res, next) => {
  try {
    console.log('createPost - req.body:', req.body);
    console.log('createPost - req.file:', req.file);
    console.log('createPost - auth user:', req.user && (req.user._id || req.user.id));

    const { title, content, category, tags, excerpt, isPublished } = req.body;
    const author = req.user ? req.user._id : req.body.author;

    let categoryId = category;
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) categoryId = categoryDoc._id;

    const post = new Post({
      title,
      content,
      category: categoryId,
      tags,
      excerpt,
      isPublished,
      author,
      featuredImage: req.file ? req.file.filename : 'default-post.jpg',
    });

    await post.save();
    await post.populate('author', 'name email');
    await post.populate('category', 'name slug');

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// Update post by slug
exports.updatePost = async (req, res, next) => {
  try {
    const updatedFields = { ...req.body };

    if (req.file) updatedFields.featuredImage = req.file.filename;

    if (updatedFields.category) {
      const categoryDoc = await Category.findOne({ slug: updatedFields.category });
      if (categoryDoc) updatedFields.category = categoryDoc._id;
    }

    const updatedPost = await Post.findOne({ slug: req.params.slug });

    if (!updatedPost) return res.status(404).json({ success: false, message: 'Post not found' });

    // Authorization: only author can update
    if (updatedPost.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    Object.assign(updatedPost, updatedFields);
    await updatedPost.save();
    await updatedPost.populate('author', 'name email');
    await updatedPost.populate('category', 'name slug');

    res.status(200).json({ success: true, data: updatedPost });
  } catch (err) {
    next(err);
  }
};

// Delete post by slug
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.remove();
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Get posts by category slug with pagination
exports.getPostsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const posts = await Post.find({ category: category._id })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// Get post by ID or slug
exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let post = null;

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      post = await Post.findById(id)
        .populate('author', 'name email')
        .populate('category', 'name slug');
    }

    if (!post) {
      post = await Post.findOne({ slug: id })
        .populate('author', 'name email')
        .populate('category', 'name slug');
    }

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};
