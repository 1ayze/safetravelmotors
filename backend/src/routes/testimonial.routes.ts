import { Router } from 'express';
import { body, query } from 'express-validator';
import { 
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  getApprovedTestimonials
} from '../controllers/testimonial.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Testimonial creation validation rules
const createTestimonialValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('carId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Car ID must be a positive integer'),
];

// Testimonial update validation rules
const updateTestimonialValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('content')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('isApproved')
    .optional()
    .isBoolean()
    .withMessage('isApproved must be a boolean value'),
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
router.get('/approved', validate(queryValidation), getApprovedTestimonials);
router.post('/', validate(createTestimonialValidation), createTestimonial);

// Protected routes (admin only)
router.get('/', authenticateToken, requireAdmin, validate(queryValidation), getAllTestimonials);
router.get('/:id', authenticateToken, requireAdmin, getTestimonialById);
router.put('/:id', authenticateToken, requireAdmin, validate(updateTestimonialValidation), updateTestimonial);
router.delete('/:id', authenticateToken, requireAdmin, deleteTestimonial);
router.patch('/:id/approve', authenticateToken, requireAdmin, approveTestimonial);

export default router;

