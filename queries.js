const allEmployeesQuery = `SELECT employee.id,employee.first_name,employee.last_name,role_.title,department.name_,role_.salary,CONCAT(manager.first_name," ",manager.last_name)
    AS manager
    FROM employee
    INNER JOIN role_ ON employee.role_id = role_.id
    INNER JOIN department ON role_.department_id = department.id
    JOIN employee AS manager ON manager.id = employee.manager_id
    UNION
    SELECT employee.id,employee.first_name,employee.last_name,role_.title,department.name_,role_.salary,employee.manager_id AS manager FROM employee
    INNER JOIN role_ ON employee.role_id = role_.id
    INNER JOIN department ON role_.department_id = department.id
    JOIN employee AS manager ON employee.manager_id IS NULL
    ORDER BY id ASC;`;

const employeesByDepQuery = (department) => {
	return `SELECT employee.id,employee.first_name,employee.last_name,role_.title,role_.salary,CONCAT(manager.first_name," ",manager.last_name)
    AS manager
    FROM employee
    INNER JOIN role_ ON employee.role_id = role_.id
    INNER JOIN department ON role_.department_id = department.id  AND department.name_ = "${department}"
    JOIN employee AS manager ON manager.id = employee.manager_id
    UNION
    SELECT employee.id,employee.first_name,employee.last_name,role_.title,role_.salary,employee.manager_id AS manager FROM employee
    INNER JOIN role_ ON employee.role_id = role_.id
    INNER JOIN department ON role_.department_id = department.id  AND department.name_ = "${department}"
    JOIN employee AS manager ON employee.manager_id IS NULL
    ORDER BY id ASC;`;
};
exports.allEmployeesQuery = allEmployeesQuery;
exports.employeesByDepQuery = employeesByDepQuery;
