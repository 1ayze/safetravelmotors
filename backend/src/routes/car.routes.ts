import { Router } from 'express';
import {
  getAllCars,
  getFeaturedCars,
  getCarById,
  searchCars,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImages
} from '../controllers/car.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllCars);
router.get('/featured', getFeaturedCars);
router.get('/search', searchCars);
router.get('/:id', getCarById);

// Admin routes (require authentication)
router.post('/', authenticateToken, requireAdmin, uploadCarImages, createCar);
router.put('/:id', authenticateToken, requireAdmin, uploadCarImages, updateCar);
router.delete('/:id', authenticateToken, requireAdmin, deleteCar);

export default router;