import { Router } from 'express';
import { body, query } from 'express-validator';
import { 
  getAllContactInquiries,
  getContactInquiryById,
  createContactInquiry,
  markInquiryAsRead,
  deleteContactInquiry,
  subscribeToNewsletter,
  getAllNewsletterSubscriptions
} from '../controllers/contact.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Contact inquiry validation rules
const contactInquiryValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
];

// Newsletter subscription validation rules
const newsletterValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
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
router.post('/inquiry', validate(contactInquiryValidation), createContactInquiry);
router.post('/newsletter', validate(newsletterValidation), subscribeToNewsletter);

// Protected routes (admin only)
router.get('/inquiries', authenticateToken, requireAdmin, validate(queryValidation), getAllContactInquiries);
router.get('/inquiries/:id', authenticateToken, requireAdmin, getContactInquiryById);
router.patch('/inquiries/:id/read', authenticateToken, requireAdmin, markInquiryAsRead);
router.delete('/inquiries/:id', authenticateToken, requireAdmin, deleteContactInquiry);
router.get('/newsletter', authenticateToken, requireAdmin, validate(queryValidation), getAllNewsletterSubscriptions);

export default router;

