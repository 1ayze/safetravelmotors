-- Database Schema for SafeTravels Motors Car Dealership System
-- This file contains the MySQL schema for the application
-- Generated for collaborators to understand the database structure

-- Create the database (run this first if not already created)
CREATE DATABASE IF NOT EXISTS myapp_db;
USE myapp_db;

-- Users table for admin authentication
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'ADMIN',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cars table for inventory management
CREATE TABLE cars (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    mileage INT NOT NULL,
    price FLOAT NOT NULL,
    bodyType VARCHAR(255) NOT NULL,
    transmission VARCHAR(255) NOT NULL,
    `condition` VARCHAR(255) NOT NULL,
    fuelType VARCHAR(255) NOT NULL,
    engineSize VARCHAR(255) NOT NULL,
    doors INT NOT NULL,
    cylinders INT NOT NULL,
    description VARCHAR(255),
    images VARCHAR(255),
    isFeatured BOOLEAN NOT NULL DEFAULT FALSE,
    isAvailable BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, createdAt, updatedAt)
VALUES ('admin', 'admin@safetravelsmotors.com', '$2a$12$i/6O32ZMbbkC9754T5Bma.v.MG.bmpWvDFbsmTY0bO3hJ7883QHCO', 'ADMIN', NOW(), NOW());

-- Indexes for better performance
CREATE INDEX idx_cars_make ON cars(make);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_condition ON cars(`condition`);
CREATE INDEX idx_cars_is_featured ON cars(isFeatured);
CREATE INDEX idx_cars_is_available ON cars(isAvailable);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Comments for documentation
-- Users table: Stores admin users for authentication
-- Cars table: Stores car inventory with all specifications
-- Note: 'condition' is backticked because it's a MySQL reserved word
-- Images field stores JSON array of image URLs
-- isFeatured: true for cars shown on homepage
-- isAvailable: true for cars currently in stock
