
module.exports = (bodySchema = null, paramSchema = null) => {
  return (req, res, next) => {
    // Validate body if schema provided
    if (bodySchema) {
      const { error: bodyError } = bodySchema.validate(req.body);
      if (bodyError) {
        return res.status(400).json({
          success: false,
          message: bodyError.details[0].message,
        });
      }
    }

    // Validate params if schema provided
    if (paramSchema) {
      const { error: paramError } = paramSchema.validate(req.params);
      if (paramError) {
        return res.status(400).json({
          success: false,
          message: paramError.details[0].message,
        });
      }
    }

    next();
  };
};
