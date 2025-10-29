module.exports = (schema) => (req, res, next) => {
  try {
    // Normalize multipart/form-data fields produced by multer/form-data
    if (req.is && req.is('multipart/form-data')) {
      // support tags[] repeated fields
      if (req.body['tags[]']) {
        req.body.tags = Array.isArray(req.body['tags[]']) ? req.body['tags[]'] : [req.body['tags[]']];
        delete req.body['tags[]'];
      } else if (typeof req.body.tags === 'string') {
        const s = req.body.tags.trim();
        if (s.startsWith('[')) {
          try {
            req.body.tags = JSON.parse(s);
          } catch (e) {
            req.body.tags = s.length ? s.split(',').map(t => t.trim()).filter(Boolean) : [];
          }
        } else {
          req.body.tags = s.length ? s.split(',').map(t => t.trim()).filter(Boolean) : [];
        }
      }

      // convert boolean-like strings to booleans
      if (typeof req.body.isPublished === 'string') {
        req.body.isPublished = req.body.isPublished === 'true' || req.body.isPublished === '1';
      }
    }
  } catch (err) {
    console.warn('validateRequest normalization error:', err);
  }

  // If user is authenticated and author not provided, inject user id so Joi 'author' requirement passes
  try {
    if (!req.body.author && req.user && (req.user._id || req.user.id)) {
      req.body.author = String(req.user._id || req.user.id);
    }
  } catch (e) {
    // ignore
  }

  // run Joi validation (keep your existing options)
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, error: error.details.map(d => d.message).join(', ') });
  }

  // replace body with validated & normalized value
  req.body = value;
  next();
};
