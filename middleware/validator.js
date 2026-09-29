/**
 * Validation Middleware for Blog Post Requests
 */

export const validateCreatePost = (req, res, next) => {
  const { title, content, author, category } = req.body || {};
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required and must not be empty' });
  } else if (title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push({ field: 'content', message: 'Content is required and must not be empty' });
  } else if (content.trim().length < 10) {
    errors.push({ field: 'content', message: 'Content must be at least 10 characters long' });
  }

  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    errors.push({ field: 'author', message: 'Author name is required and must not be empty' });
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Category is required and must not be empty' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed: Please provide all required blog post fields',
      errors,
    });
  }

  next();
};

export const validateUpdatePost = (req, res, next) => {
  const { title, content, author, category } = req.body || {};
  const errors = [];

  // Check if at least one field is provided
  const hasAtLeastOneField =
    title !== undefined ||
    content !== undefined ||
    author !== undefined ||
    category !== undefined;

  if (!hasAtLeastOneField) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed: Please provide at least one field to update (title, content, author, or category)',
    });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length < 3)) {
    errors.push({ field: 'title', message: 'Title must be a non-empty string of at least 3 characters' });
  }

  if (content !== undefined && (typeof content !== 'string' || content.trim().length < 10)) {
    errors.push({ field: 'content', message: 'Content must be a non-empty string of at least 10 characters' });
  }

  if (author !== undefined && (typeof author !== 'string' || author.trim().length === 0)) {
    errors.push({ field: 'author', message: 'Author must be a non-empty string' });
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim().length === 0)) {
    errors.push({ field: 'category', message: 'Category must be a non-empty string' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed: Invalid update parameters',
      errors,
    });
  }

  next();
};
