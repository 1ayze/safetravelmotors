import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '../middleware/error.middleware';

/**
 * Generate URL-friendly slug from title
 */
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

/**
 * Get all blog posts with pagination
 */
export const getAllBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, published = 'true' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (published === 'true') {
      where.published = true;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          author: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        posts,
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
 * Get blog post by slug
 */
export const getBlogPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundError('Blog post not found');
    }

    // Only return published posts to public, unless user is admin
    if (!post.published && !req.user) {
      throw new NotFoundError('Blog post not found');
    }

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new blog post
 */
export const createBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, excerpt, author } = req.body;
    const file = req.file as Express.Multer.File;

    // Generate slug from title
    let slug = generateSlug(title);
    
    // Ensure slug is unique
    let counter = 1;
    let originalSlug = slug;
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Process featured image
    let featuredImage: string | undefined;
    if (file) {
      featuredImage = `/uploads/${file.filename}`;
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        featuredImage,
        author,
        published: false, // Default to unpublished
      },
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update blog post
 */
export const updateBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, author } = req.body;
    const file = req.file as Express.Multer.File;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPost) {
      throw new NotFoundError('Blog post not found');
    }

    // Build update data
    const updateData: any = {};
    
    if (title && title !== existingPost.title) {
      updateData.title = title;
      // Generate new slug if title changed
      let slug = generateSlug(title);
      let counter = 1;
      let originalSlug = slug;
      while (await prisma.blogPost.findUnique({ 
        where: { 
          slug,
          NOT: { id: parseInt(id) }
        } 
      })) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }
    
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (author) updateData.author = author;

    // Process featured image
    if (file) {
      updateData.featuredImage = `/uploads/${file.filename}`;
    }

    // Update blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: { post: updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete blog post
 */
export const deleteBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      throw new NotFoundError('Blog post not found');
    }

    // Delete blog post
    await prisma.blogPost.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Publish blog post
 */
export const publishBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      throw new NotFoundError('Blog post not found');
    }

    // Update post to published
    const updatedPost = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: {
        published: true,
        publishedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Blog post published successfully',
      data: { post: updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unpublish blog post
 */
export const unpublishBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      throw new NotFoundError('Blog post not found');
    }

    // Update post to unpublished
    const updatedPost = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: {
        published: false,
        publishedAt: null,
      },
    });

    res.json({
      success: true,
      message: 'Blog post unpublished successfully',
      data: { post: updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

