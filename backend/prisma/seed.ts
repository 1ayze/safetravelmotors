import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@safetravelsmotors.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.username);

  // Create sample cars
  const sampleCars = [
    {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      mileage: 15000,
      price: 25000.00,
      bodyType: 'Sedan',
      transmission: 'Automatic',
      condition: 'Used',
      fuelType: 'Petrol',
      engineSize: '2.5L',
      doors: 4,
      cylinders: 4,
      description: 'Excellent condition Toyota Camry with low mileage. Perfect for daily commuting with great fuel efficiency.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
      ]),
      isFeatured: true,
    },
    {
      make: 'Honda',
      model: 'CR-V',
      year: 2021,
      mileage: 25000,
      price: 28000.00,
      bodyType: 'SUV',
      transmission: 'Automatic',
      condition: 'Used',
      fuelType: 'Petrol',
      engineSize: '1.5L Turbo',
      doors: 5,
      cylinders: 4,
      description: 'Spacious Honda CR-V with excellent safety ratings. Perfect for families with plenty of cargo space.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
      ]),
      isFeatured: true,
    },
    {
      make: 'BMW',
      model: '3 Series',
      year: 2023,
      mileage: 5000,
      price: 45000.00,
      bodyType: 'Sedan',
      transmission: 'Automatic',
      condition: 'New',
      fuelType: 'Petrol',
      engineSize: '2.0L Turbo',
      doors: 4,
      cylinders: 4,
      description: 'Luxury BMW 3 Series with premium features and exceptional performance. Like new condition.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
      ]),
      isFeatured: true,
    },
  ];

  for (const carData of sampleCars) {
    const car = await prisma.car.create({
      data: carData,
    });
    console.log(`✅ Car created: ${car.make} ${car.model} ${car.year}`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


