-- init.sql

CREATE DATABASE IF NOT EXISTS combinations;

USE combinations;

CREATE TABLE IF NOT EXISTS items (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     item VARCHAR(10) NOT NULL Unique,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS responses (
                                         id INT PRIMARY KEY AUTO_INCREMENT,
                                         response JSON,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS combinations
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    combination TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_combination (combination(255))
)
