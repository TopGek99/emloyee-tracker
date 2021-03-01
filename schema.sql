DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT;
    first_name VARCHAR(30);
    
)