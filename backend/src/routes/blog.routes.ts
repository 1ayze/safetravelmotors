import { Router } from 'express';
import { body, query } from 'express-validator';
import { 
  getAllBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost
} from '../controllers/blog.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { upload } from '../utils/uploader';

const router = Router();

// Blog post creation validation rules
const createBlogPostValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters long'),
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters'),
];

// Blog post update validation rules
const updateBlogPostValidation = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .optional()
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters long'),
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('author')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters'),
];

// Query validation for pagination
const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
];

// Public routes
router.get('/', validate(queryValidation), getAllBlogPosts);
router.get('/:slug', getBlogPostBySlug);

// Protected routes (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('featuredImage'), validate(createBlogPostValidation), createBlogPost);
router.put('/:id', authenticateToken, requireAdmin, upload.single('featuredImage'), validate(updateBlogPostValidation), updateBlogPost);
router.delete('/:id', authenticateToken, requireAdmin, deleteBlogPost);
router.patch('/:id/publish', authenticateToken, requireAdmin, publishBlogPost);
router.patch('/:id/unpublish', authenticateToken, requireAdmin, unpublishBlogPost);

export default router;

