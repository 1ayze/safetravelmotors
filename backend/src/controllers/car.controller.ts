import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError, NotFoundError, ValidationError } from '../middleware/error.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/cars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export const uploadCarImages = upload.array('images', 10); // Max 10 images

/**
 * Get all cars with pagination and filtering
 */
export const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 12,
      make,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      maxMileage,
      fuelType,
      transmission,
      bodyType,
      condition,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (make) where.make = { contains: make as string, mode: 'insensitive' };
    if (model) where.model = { contains: model as string, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = parseInt(minYear as string);
      if (maxYear) where.year.lte = parseInt(maxYear as string);
    }
    if (maxMileage) where.mileage = { lte: parseInt(maxMileage as string) };
    if (fuelType) where.fuelType = fuelType as string;
    if (transmission) where.transmission = transmission as string;
    if (bodyType) where.bodyType = bodyType as string;
    if (condition) where.condition = condition as string;

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder as string;

    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
      }),
      prisma.car.count({ where })
    ]);

    // Parse images for each car
    const carsWithParsedData = cars.map(car => ({
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    }));

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        cars: carsWithParsedData,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured cars
 */
export const getFeaturedCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cars = await prisma.car.findMany({
      where: { isFeatured: true, isAvailable: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    });

    const carsWithParsedData = cars.map(car => ({
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    }));

    res.json({
      success: true,
      data: { cars: carsWithParsedData }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get car by ID
 */
export const getCarById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) }
    });

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    const carWithParsedData = {
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    };

    res.json({
      success: true,
      data: { car: carWithParsedData }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search cars
 */
export const searchCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      q,
      page = 1,
      limit = 12,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      maxMileage,
      fuelType,
      transmission,
      bodyType
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for search
    const where: any = {
      OR: [
        { make: { contains: q as string, mode: 'insensitive' } },
        { model: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } }
      ]
    };

    // Add additional filters
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = parseInt(minYear as string);
      if (maxYear) where.year.lte = parseInt(maxYear as string);
    }
    if (maxMileage) where.mileage = { lte: parseInt(maxMileage as string) };
    if (fuelType) where.fuelType = fuelType as string;
    if (transmission) where.transmission = transmission as string;
    if (bodyType) where.bodyType = bodyType as string;

    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.car.count({ where })
    ]);

    const carsWithParsedData = cars.map(car => ({
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    }));

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        cars: carsWithParsedData,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new car
 */
export const createCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      make,
      model,
      year,
      mileage,
      price,
      bodyType,
      transmission,
      condition,
      fuelType,
      engineSize,
      doors,
      cylinders,
      description,
      isFeatured = false
    } = req.body;

    // Validate required fields
    if (!make || !model || !year || !mileage || !price || !bodyType || !transmission || !condition || !fuelType || !engineSize || !doors || !cylinders) {
      throw new ValidationError('All required fields must be provided');
    }

    // Handle uploaded images
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      images = req.files.map((file: any) => `/uploads/cars/${file.filename}`);
    }

    const car = await prisma.car.create({
      data: {
        make,
        model,
        year: parseInt(year),
        mileage: parseInt(mileage),
        price: parseFloat(price),
        bodyType,
        transmission,
        condition,
        fuelType,
        engineSize,
        doors: parseInt(doors),
        cylinders: parseInt(cylinders),
        description,
        images: JSON.stringify(images),
        isFeatured: isFeatured === 'true' || isFeatured === true
      }
    });

    const carWithParsedData = {
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    };

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: { car: carWithParsedData }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update car
 */
export const updateCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      make,
      model,
      year,
      mileage,
      price,
      bodyType,
      transmission,
      condition,
      fuelType,
      engineSize,
      doors,
      cylinders,
      description,
      isFeatured,
      isAvailable
    } = req.body;

    // Check if car exists
    const existingCar = await prisma.car.findUnique({ 
      where: { id: parseInt(id) } 
    });

    if (!existingCar) {
      throw new NotFoundError('Car not found');
    }

    // Handle uploaded images
    let images: string[] = existingCar.images ? JSON.parse(existingCar.images) : [];
    if (req.files && Array.isArray(req.files)) {
      const newImages = req.files.map((file: any) => `/uploads/cars/${file.filename}`);
      images = [...images, ...newImages];
    }

    const updatedCar = await prisma.car.update({      
      where: { id: parseInt(id) },
      data: {
        ...(make && { make }),
        ...(model && { model }),
        ...(year && { year: parseInt(year) }),
        ...(mileage && { mileage: parseInt(mileage) }),
        ...(price && { price: parseFloat(price) }),
        ...(bodyType && { bodyType }),
        ...(transmission && { transmission }),
        ...(condition && { condition }),
        ...(fuelType && { fuelType }),
        ...(engineSize && { engineSize }),
        ...(doors && { doors: parseInt(doors) }),
        ...(cylinders && { cylinders: parseInt(cylinders) }),
        ...(description !== undefined && { description }),
        ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' || isFeatured === true }),
        ...(isAvailable !== undefined && { isAvailable: isAvailable === 'true' || isAvailable === true }),
        ...(req.files && { images: JSON.stringify(images) })
      }
    });

    const carWithParsedData = {
      ...updatedCar,
      images: updatedCar.images ? JSON.parse(updatedCar.images) : []
    };

    res.json({
      success: true,
      message: 'Car updated successfully',
      data: { car: carWithParsedData }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete car
 */
export const deleteCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) }
    });

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    // Delete associated images from filesystem
    if (car.images) {
      const imageUrls = JSON.parse(car.images);
      imageUrls.forEach((imageUrl: string) => {
        const imagePath = path.join(__dirname, '../../', imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await prisma.car.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};