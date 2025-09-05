import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError } from '../middleware/error.middleware';

/**
 * Get all testimonials (admin only)
 */
export const getAllTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, approved } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (approved !== undefined) {
      where.isApproved = approved === 'true';
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          car: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true,
            },
          },
        },
      }),
      prisma.testimonial.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        testimonials,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get approved testimonials (public)
 */
export const getApprovedTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          car: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true,
            },
          },
        },
      }),
      prisma.testimonial.count({ where: { isApproved: true } }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        testimonials,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get testimonial by ID
 */
export const getTestimonialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id) },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
          },
        },
      },
    });

    if (!testimonial) {
      throw new NotFoundError('Testimonial not found');
    }

    res.json({
      success: true,
      data: { testimonial },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new testimonial
 */
export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, content, rating = 5, carId } = req.body;

    // If carId is provided, verify the car exists
    if (carId) {
      const car = await prisma.car.findUnique({
        where: { id: parseInt(carId) },
      });

      if (!car) {
        throw new NotFoundError('Car not found');
      }
    }

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        email,
        content,
        rating: parseInt(rating),
        carId: carId ? parseInt(carId) : null,
        isApproved: false, // Default to unapproved
      },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully. It will be reviewed before being published.',
      data: { testimonial },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update testimonial
 */
export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, content, rating, isApproved } = req.body;

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTestimonial) {
      throw new NotFoundError('Testimonial not found');
    }

    // Build update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (content) updateData.content = content;
    if (rating) updateData.rating = parseInt(rating);
    if (isApproved !== undefined) updateData.isApproved = isApproved === 'true' || isApproved === true;

    // Update testimonial
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: { testimonial: updatedTestimonial },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete testimonial
 */
export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if testimonial exists
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id) },
    });

    if (!testimonial) {
      throw new NotFoundError('Testimonial not found');
    }

    // Delete testimonial
    await prisma.testimonial.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve testimonial
 */
export const approveTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if testimonial exists
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id) },
    });

    if (!testimonial) {
      throw new NotFoundError('Testimonial not found');
    }

    // Update testimonial to approved
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: { isApproved: true },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Testimonial approved successfully',
      data: { testimonial: updatedTestimonial },
    });
  } catch (error) {
    next(error);
  }
};

