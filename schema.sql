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
    FOREIGN KEY (role_id) REFERENCES role_(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

SELECT employee.id,employee.first_name,employee.last_name,role_.title,department.name_,role_.salary,concat(manager.first_name,' ',manager.last_name) AS manager FROM employee
INNER JOIN role_ ON employee.role_id = role_.id
INNER JOIN department ON role_.department_id = department.id AND department.name_ = "Sales"
JOIN employee AS manager ON manager.id = employee.manager_id
UNION
SELECT employee.id,employee.first_name,employee.last_name,role_.title,department.name_,role_.salary,employee.manager_id AS manager FROM employee
INNER JOIN role_ ON employee.role_id = role_.id
INNER JOIN department ON role_.department_id = department.id  AND department.name_ = "Sales"
JOIN employee AS manager ON employee.manager_id IS NULL
ORDER BY id ASC;
