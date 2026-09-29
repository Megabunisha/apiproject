import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { validateCreatePost, validateUpdatePost } from '../middleware/validator.js';

const router = express.Router();

/**
 * @route   GET /posts & POST /posts
 */
router
  .route('/')
  .get(getAllPosts)
  .post(validateCreatePost, createPost);

/**
 * @route   GET /posts/:id, PUT /posts/:id, DELETE /posts/:id
 */
router
  .route('/:id')
  .get(getPostById)
  .put(validateUpdatePost, updatePost)
  .delete(deletePost);

export default router;
