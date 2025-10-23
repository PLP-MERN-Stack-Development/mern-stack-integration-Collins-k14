// validation/postValidation.js
const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string().max(100).required(),
  content: Joi.string().required(),
  featuredImage: Joi.string().optional(),
  excerpt: Joi.string().max(200).optional(),
  author: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional()
});

module.exports = postSchema;
