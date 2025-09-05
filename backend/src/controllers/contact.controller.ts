import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ConflictError } from '../middleware/error.middleware';

/**
 * Get all contact inquiries (admin only)
 */
export const getAllContactInquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (unread === 'true') {
      where.isRead = false;
    }

    const [inquiries, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.contactInquiry.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        inquiries,
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
 * Get contact inquiry by ID
 */
export const getContactInquiryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      throw new NotFoundError('Contact inquiry not found');
    }

    res.json({
      success: true,
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create contact inquiry
 */
export const createContactInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Create contact inquiry
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        isRead: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark inquiry as read
 */
export const markInquiryAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if inquiry exists
    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      throw new NotFoundError('Contact inquiry not found');
    }

    // Update inquiry to read
    const updatedInquiry = await prisma.contactInquiry.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: 'Inquiry marked as read',
      data: { inquiry: updatedInquiry },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete contact inquiry
 */
export const deleteContactInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if inquiry exists
    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      throw new NotFoundError('Contact inquiry not found');
    }

    // Delete inquiry
    await prisma.contactInquiry.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Contact inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Subscribe to newsletter
 */
export const subscribeToNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Check if email is already subscribed
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        throw new ConflictError('Email is already subscribed to our newsletter');
      } else {
        // Reactivate subscription
        const reactivatedSubscription = await prisma.newsletterSubscription.update({
          where: { email },
          data: { isActive: true },
        });

        return res.json({
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
          data: { subscription: reactivatedSubscription },
        });
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
      data: { subscription },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all newsletter subscriptions (admin only)
 */
export const getAllNewsletterSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50, active } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const [subscriptions, total] = await Promise.all([
      prisma.newsletterSubscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.newsletterSubscription.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        subscriptions,
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

