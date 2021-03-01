DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT;
    first_name VARCHAR(30);
    last_name VARCHAR(30);
    role_id INTEGER FOREIGN KEY (role_);
    manager_id INTEGER FOREIGN KEY (employee);
);

CREATE TABLE role_ (
    id INTEGER PRIMARY KEY AUTOINCREMENT;
    title VARCHAR(30);
    salary DECIMAL;
    department_id INTEGER FOREIGN KEY (department);
);

CREATE TABLE department (
    id INTEGER PRIMARY KEY AUTOINCREMENT;
    name VARCHAR(30);
);