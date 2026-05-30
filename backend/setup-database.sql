-- ═══════════════════════════════════════════════════════════════
--  PRESIDENTIAL LUXURY HOTEL — MySQL Setup Script
--  Run this once as root before starting the application
-- ═══════════════════════════════════════════════════════════════

-- Create database
CREATE DATABASE IF NOT EXISTS hotel_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create application user (change password in production)
CREATE USER IF NOT EXISTS 'hotel_user'@'localhost' IDENTIFIED BY 'hotel_password_2024';
GRANT ALL PRIVILEGES ON hotel_db.* TO 'hotel_user'@'localhost';
FLUSH PRIVILEGES;

-- Switch to database
USE hotel_db;
