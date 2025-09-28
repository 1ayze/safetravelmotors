CREATE TABLE "_prisma_migrations" (
    "id"                    VARCHAR(255) PRIMARY KEY NOT NULL,
    "checksum"              VARCHAR(255) NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        VARCHAR(255) NOT NULL,
    "logs"                  VARCHAR(255),
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);

CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "cars" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    "make" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "price" FLOAT NOT NULL,
    "bodyType" VARCHAR(255) NOT NULL,
    "transmission" VARCHAR(255) NOT NULL,
    "condition" VARCHAR(255) NOT NULL,
    "fuelType" VARCHAR(255) NOT NULL,
    "engineSize" VARCHAR(255) NOT NULL,
    "doors" INTEGER NOT NULL,
    "cylinders" INTEGER NOT NULL,
    "description" VARCHAR(255),
    "images" VARCHAR(255),
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES
('61d14a04-dbc0-4654-b052-c260d92e86ba', '678e7c5888c60b8cb58f720c9d2414760ecff0689292dcd54dc115844ada2cc4', 1757017532749, '20250904202532_init', NULL, NULL, 1757017532738, 1),
('8e81fa36-45fe-486e-b57a-8657528ab253', '9ea4d45d751ffe6836458fc560a4faddadd51c0c1c3a9e5f769096dd818ebe97', 1757020851859, '20250904212051_add_cars', NULL, NULL, 1757020851851, 1);

INSERT INTO cars (id, make, model, year, mileage, price, bodyType, transmission, condition, fuelType, engineSize, doors, cylinders, description, images, isFeatured, isAvailable, createdAt, updatedAt) VALUES
(1, 'Toyota', 'Camry', 2024, 40000, 37000, 'Sedan', 'Automatic', 'Used', 'Diesel', '2.0L', 4, 6, '', '["/uploads/cars/images-1757339294069-104201900.jpg"]', 1, 1, 1757339294077, 1757339294077),
(2, 'Kia', 'Sorento', 2023, 67000, 23000, 'SUV', 'Automatic', 'Certified Pre-owned', 'Diesel', '2.0L', 4, 6, '', '["/uploads/cars/images-1758559981206-898023904.webp"]', 0, 1, 1758559981215, 1758559981215),
(3, 'Kia', 'Sorento', 2024, 67000, 23000, 'SUV', 'Automatic', 'Certified Pre-owned', 'Diesel', '2.0L', 4, 6, '', '["/uploads/cars/images-1758560123458-863567696.webp"]', 0, 1, 1758560123464, 1758560123464),
(4, 'Kia', 'Sorento', 2025, 67000, 23000, 'SUV', 'Automatic', 'Certified Pre-owned', 'Diesel', '2.0L', 4, 6, '', '["/uploads/cars/images-1758561830345-815189827.webp"]', 0, 1, 1758561830349, 1758561830349),
(5, 'Kia', 'Sorento', 2025, 67000, 23000, 'SUV', 'Automatic', 'Certified Pre-owned', 'Diesel', '3.5L', 4, 6, '', '["/uploads/cars/images-1758562924804-682112412.webp"]', 0, 1, 1758562924810, 1758562924810);

INSERT INTO users (id, username, email, password, role, createdAt, updatedAt) VALUES
(1, 'admin', 'admin@safetravelsmotors.com', '$2a$12$i/6O32ZMbbkC9754T5Bma.v.MG.bmpWvDFbsmTY0bO3hJ7883QHCO', 'ADMIN', 1757017637218, 1757017637218);

