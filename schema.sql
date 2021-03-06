DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name_ VARCHAR(30)
);

CREATE TABLE role_ (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    ismanager BOOLEAN,
    FOREIGN KEY (role_id) REFERENCES role_(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);