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
        "Add Department",
        "Remove Department",
        "View Department Budget Usage",
        "Exit",
      ],
    })
    .then((answers) => {
      switch (answers.decision) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Employees By Department":
          viewEmployeesByDep();
          break;
        case "View All Employees By Manager":
          viewEmployeesByManager();
          break;
        case "Add Employee":
          addEmployee();
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
    init();
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
          init();
        }
      );
    });
};

const viewEmployeesByManager = () => {
  connection.query(
    "SELECT id AS manager_id, CONCAT(first_name,' ',last_name) AS manager_name FROM employee WHERE ismanager IS TRUE;",
    (err, res) => {
      // console.log(res);
      var managers = [];
      res.forEach((obj) => {
        managers.push(obj);
        // console.log(managers);
      });
      var managerNames = managers.map((manager) => manager.manager_name);
      inquirer
        .prompt({
          name: "manager",
          message: "Which manager's employees would you like to view?",
          type: "list",
          choices: managerNames,
        })
        .then((answers) => {
          connection.query(
            queries.employeesByManagerQuery(
              managers.find(
                (manager) => manager.manager_name == answers.manager
              ).manager_id
            ),
            (err, res) => {
              if (err) throw err;
              console.table(res);
              init();
            }
          );
        });
    }
  );
};

const addEmployee = () => {
  connection.query(`SELECT title FROM role_;`, (err, res) => {
    let roles = res.map((role) => role.title);
    inquirer
      .prompt([
        {
          name: "first_name",
          message: "What is your employees first name?",
          type: "input",
        },
        {
          name: "last_name",
          message: "What is your employees last name?",
          type: "input",
        },
        {
          name: "role",
          message: "What is your employees role?",
          type: "list",
          choices: roles,
        },
        {
          name: "manager",
          message: "Who is your employees manager?",
          type: "list",
          choices: roles,
        },
      ])
      .then((answers) => {});
  });
};
