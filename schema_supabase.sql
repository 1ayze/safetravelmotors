-- Database Schema for SafeTravels Motors Car Dealership System
-- This file contains the PostgreSQL schema for Supabase
-- Run this in Supabase SQL Editor to set up the database

-- Users table for admin authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'ADMIN',
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cars table for inventory management
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    price REAL NOT NULL,
    bodyType VARCHAR(255) NOT NULL,
    transmission VARCHAR(255) NOT NULL,
    condition VARCHAR(255) NOT NULL,
    fuelType VARCHAR(255) NOT NULL,
    engineSize VARCHAR(255) NOT NULL,
    doors INTEGER NOT NULL,
    cylinders INTEGER NOT NULL,
    description TEXT,
    images TEXT,
    isFeatured BOOLEAN NOT NULL DEFAULT FALSE,
    isAvailable BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, createdAt, updatedAt)
VALUES ('admin', 'admin@safetravelsmotors.com', '$2a$12$i/6O32ZMbbkC9754T5Bma.v.MG.bmpWvDFbsmTY0bO3hJ7883QHCO', 'ADMIN', NOW(), NOW());

-- Indexes for better performance
CREATE INDEX idx_cars_make ON cars(make);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_condition ON cars(condition);
CREATE INDEX idx_cars_is_featured ON cars(isFeatured);
CREATE INDEX idx_cars_is_available ON cars(isAvailable);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Trigger to update updatedAt on row changes (optional, can be handled in app code)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
-- Users table: Stores admin users for authentication
-- Cars table: Stores car inventory with all specifications
-- Note: 'condition' is not a reserved word in PostgreSQL, no backticks needed
-- Images field stores JSON array of image URLs
-- isFeatured: true for cars shown on homepage
-- isAvailable: true for cars currently in stock
-- Triggers handle updatedAt automatically; remove if handling in application code
