//slugValidation
const Joi = require('joi');

const slugSchema = Joi.object({
  slug: Joi.string().required()
});

module.exports = slugSchema;
