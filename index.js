const mysql = require("mysql");
const inquirer = require("inquirer");
const queries = require("./queries");
const cTable = require("console.table");

const connection = mysql.createConnection({
	host: "localhost",

	port: 3306,

	user: "root",

	password: "root",
	database: "employee_trackerDB",
});

connection.connect((err) => {
	if (err) throw err;
	init();
	// connection.end();
});

const init = () => {
	inquirer
		.prompt({
			name: "decision",
			message: "What would you like to do?",
			type: "list",
			choices: [
				"View All Employees",
				"View All Employees By Department",
				"View All Employees By Manager",
				"Add Employee",
				"Remove Employee",
				"Update Employee Role",
				"Update Employee Manager",
				"View All Roles",
				"Add Role",
				"Remove Role",
				"View All Departments",
				"Add Departments",
				"Remove Department",
				"View Department Budget Usage",
			],
		})
		.then((answers) => {
			switch (answers.decision) {
				case "View All Employees":
					viewEmployees();
					init();
					break;
				case "View All Employees By Department":
					viewEmployeesByDep();
					init();
					break;
				default:
					break;
			}
		});
};

const viewEmployees = () => {
	connection.query(queries.allEmployeesQuery, (err, res) => {
		if (err) throw err;
		console.table(res);
	});
};

const viewEmployeesByDep = () => {
	inquirer
		.prompt({
			name: "department",
			message: "Which department would you like to view?",
			type: "list",
			choices: ["Sales", "Engineering", "Finance", "Legal"],
		})
		.then((answers) => {
			connection.query(
				queries.employeesByDepQuery(answers.department),
				(err, res) => {
					if (err) throw err;
					console.table(res);
				}
			);
		});
};
