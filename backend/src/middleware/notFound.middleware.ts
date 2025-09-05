import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle 404 Not Found errors
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      auth: '/api/auth',
      cars: '/api/cars',
      blog: '/api/blog',
      testimonials: '/api/testimonials',
      contact: '/api/contact',
      health: '/health',
    },
  });
};

