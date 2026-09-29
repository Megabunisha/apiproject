import { PostModel } from '../models/postModel.js';

/**
 * @desc    Get all blog posts (with optional query filtering)
 * @route   GET /posts or GET /api/posts
 * @access  Public
 */
export const getAllPosts = async (req, res, next) => {
  try {
    const { search, category, author, sort } = req.query;

    const posts = await PostModel.getAll({ search, category, author, sort });

    res.status(200).json({
      success: true,
      statusCode: 200,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single blog post by ID
 * @route   GET /posts/:id or GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await PostModel.getById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Blog post with ID '${id}' was not found`,
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new blog post
 * @route   POST /posts or POST /api/posts
 * @access  Public
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, content, author, category } = req.body;

    const newPost = await PostModel.create({ title, content, author, category });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Blog post created successfully',
      data: newPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing blog post by ID
 * @route   PUT /posts/:id or PUT /api/posts/:id
 * @access  Public
 */
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, author, category } = req.body;

    const updatedPost = await PostModel.update(id, { title, content, author, category });

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Cannot update: Blog post with ID '${id}' does not exist`,
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Blog post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a blog post by ID
 * @route   DELETE /posts/:id or DELETE /api/posts/:id
 * @access  Public
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPost = await PostModel.delete(id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Cannot delete: Blog post with ID '${id}' does not exist`,
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Blog post deleted successfully',
      data: deletedPost,
    });
  } catch (error) {
    next(error);
  }
};
