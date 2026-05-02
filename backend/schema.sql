-- Create the project database and tables for College Bus Management System
CREATE DATABASE IF NOT EXISTS `college_bus_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `college_bus_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(50),
  `password` VARCHAR(255) NOT NULL,
  `status` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `rejectionReason` VARCHAR(255),
  `studentId` VARCHAR(100),
  `childName` VARCHAR(255),
  `licenseNumber` VARCHAR(100),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `routes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `routeName` VARCHAR(255) NOT NULL,
  `busNumber` VARCHAR(100),
  `driverName` VARCHAR(255),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `panic_alerts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` BIGINT UNSIGNED,
  `userName` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL,
  `message` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10,7) NOT NULL,
  `longitude` DECIMAL(10,7) NOT NULL,
  `locationText` VARCHAR(255) NOT NULL,
  `status` ENUM('active','resolved') NOT NULL DEFAULT 'active',
  `timestamp` VARCHAR(100) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `location_updates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` BIGINT UNSIGNED,
  `driverName` VARCHAR(255),
  `busNumber` VARCHAR(100),
  `stop` VARCHAR(255) NOT NULL,
  `stopNumber` VARCHAR(50),
  `latitude` DECIMAL(10,7) NOT NULL,
  `longitude` DECIMAL(10,7) NOT NULL,
  `locationText` VARCHAR(255) NOT NULL,
  `timestamp` VARCHAR(100) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
