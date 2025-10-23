// categoryController
const Category = require('../models/categories');
const slugify = require('slugify');

//  Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select('name slug');
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

//  Create a category

exports.createCategory = async (req, res, next) => {
  try {
    
    const name = req.body.name;
    const slug = slugify(name || '', { lower: true, strict: true });

    const category = new Category({
      name,
      slug,
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: {
        name: category.name,
        slug: category.slug,
      }
    });
  } catch (err) {
    next(err);
  }
};
