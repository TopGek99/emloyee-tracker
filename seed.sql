USE employee_trackerDB;

INSERT INTO department (name_)
VALUES ('Sales'),('Engineering'),('Finance'),('Legal');

INSERT INTO role_ (title,salary,department_id)
VALUES ('Sales Lead',100000,1),('Salesperson',60000,1),
('Lead Engineer',120000,2),('Software Engineer',75000,2),
('Account Manager',110000,3),('Accountant',65000,3),
('Legal Team Lead',135000,4),('Lawyer',100000,4);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ('Nadir','Clegg',1,null),
('Marina','King',2,1),
('Amos','Adam',3,null),
('Amrita','Burton',4,3),
('Russell','Hawkins',5,null),
('Bea','Stone',6,5),
('Terry','Wallis',7,null),
('Paolo','Brewer',8,7);