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
  updateManagers();
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
        case "Remove Employee":
          removeEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove Role":
          updateEmployeeRole();
          break;
        case "View All Departments":
          updateEmployeeRole();
          break;
        case "Add Department":
          updateEmployeeRole();
          break;
        case "Remove Department":
          updateEmployeeRole();
          break;
        case "View Department Budget Usage":
          updateEmployeeRole();
          break;
        default:
          break;
      }
    });
};

const updateManagers = () => {
  connection.query(queries.updateManagersQuery, (err, res) => {});
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
      var managers = res;
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
  connection.query(`SELECT title,id,department_id FROM role_;`, (err, res) => {
    let roleObj = res;
    let roles = roleObj.map((role) => role.title);
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
      ])
      .then((answers) => {
        let firstAnswers = answers;
        connection.query(
          queries.getManagersByDepQuery(
            roleObj.find((role) => role.title == answers.role).department_id
          ),
          (err, res) => {
            let manObj = res;
            manObj.push({
              id: null,
              manager: "They Do Not Have a Manager (They Are One)",
            });
            let managers = res.map((manager) => manager.manager);
            inquirer
              .prompt({
                name: "manager",
                message: "Who is your employees manager?",
                type: "list",
                choices: managers,
              })
              .then((answers) => {
                connection.query(
                  queries.addEmployeeQuery(
                    roleObj,
                    manObj,
                    firstAnswers,
                    answers
                  ),
                  (err, res) => {
                    console.log(`
Welcome to the team ${firstAnswers.first_name}!
                    `);
                    init();
                  }
                );
              });
          }
        );
      });
  });
};

const removeEmployee = () => {
  connection.query(
    `SELECT id,CONCAT(employee.first_name,' ',employee.last_name) AS emp FROM employee;`,
    (err, res) => {
      let employeeObj = res;
      let employees = employeeObj.map((emp) => emp.emp);
      inquirer
        .prompt({
          name: "empRemove",
          message: "Which employee would you like to remove?",
          type: "list",
          choices: employees,
        })
        .then((answers) => {
          console.log(employeeObj.find((emp) => emp.emp == answers.empRemove));
          connection.query(
            `DELETE FROM employee WHERE id = ${
              employeeObj.find((emp) => emp.emp == answers.empRemove).id
            }`,
            (err, res) => {
              //   console.log(err);
              if (res == undefined) {
                console.log(
                  `
Could not remove ${answers.empRemove} (make sure they are not another employee's manager)
                  `
                );
              } else {
                console.log(`
${answers.empRemove} Removed Successfully!
                `);
              }
              init();
            }
          );
        });
    }
  );
};

const updateEmployeeRole = () => {
  connection.query(
    `SELECT id,CONCAT(employee.first_name,' ',employee.last_name) AS emp FROM employee;`,
    (err, res) => {
      let empObj = res;
      let employees = empObj.map((emp) => emp.emp);
      inquirer
        .prompt({
          name: "empUpdate",
          message: "Which employee would you like to update the role of?",
          type: "list",
          choices: employees,
        })
        .then((answers) => {
          let empAnswer = answers;
          connection.query(`SELECT title,id FROM role_;`, (err, res) => {
            let roleObj = res;
            let roles = roleObj.map((role) => role.title);
            inquirer
              .prompt({
                name: "role",
                message: "What role would you like to update to?",
                type: "list",
                choices: roles,
              })
              .then((answers) => {
                connection.query(
                  `UPDATE employee SET role_id = ${
                    roleObj.find((role) => role.title == answers.role).id
                  } WHERE id = ${
                    empObj.find((emp) => emp.emp == empAnswer.empUpdate).id
                  }`,
                  (err, res) => {
                    console.log(`
${empAnswer.empUpdate}'s role successfully updated to ${answers.role}!
                        `);
                    init();
                  }
                );
              });
          });
        });
    }
  );
};

const updateEmployeeManager = () => {
  connection.query(
    `SELECT id,CONCAT(employee.first_name,' ',employee.last_name) AS emp FROM employee;`,
    (err, res) => {
      let empObj = res;
      let employees = empObj.map((emp) => emp.emp);
      inquirer
        .prompt({
          name: "empUpdate",
          message: "Which employee would you like to update the manager of?",
          type: "list",
          choices: employees,
        })
        .then((answers) => {
          let empAnswer = answers;
          connection.query(
            `SELECT id,CONCAT(first_name,' ',last_name) AS manager FROM employee WHERE ismanager;`,
            (err, res) => {
              let manObj = res;
              manObj.push({
                id: null,
                manager: "They Do Not Have a Manager (They Are One)",
              });
              let managers = res.map((manager) => manager.manager);
              inquirer
                .prompt({
                  name: "manager",
                  message: "Who is your employees new manager?",
                  type: "list",
                  choices: managers,
                })
                .then((answers) => {
                  connection.query(
                    `UPDATE employee SET manager_id = ${
                      manObj.find(
                        (manager) => manager.manager == answers.manager
                      ).id
                    } WHERE id = ${
                      empObj.find((emp) => emp.emp == empAnswer.empUpdate).id
                    }`,
                    (err, res) => {
                      console.log(`
${empAnswer.empUpdate}'s manager successfully updated to ${answers.manager}!
                        `);
                      init();
                    }
                  );
                });
            }
          );
        });
    }
  );
};

const viewRoles = () => {
  connection.query(
    `SELECT role_.title AS role,role_.salary,department.name_ AS department FROM role_
INNER JOIN department ON role_.department_id = department.id;`,
    (err, res) => {
      console.table(res);
      init();
    }
  );
};

const addRole = () => {
  connection.query(`SELECT name_,id FROM department;`, (err, res) => {
    let depObj = res;
    let departments = depObj.map((department) => department.name_);
    inquirer
      .prompt([
        {
          name: "role_title",
          message: "What is the title of the new role?",
          type: "input",
        },
        {
          name: "role_salary",
          message: "What is the starting salary for this role?",
          type: "input",
        },
        {
          name: "department",
          message: "What department is this role in?",
          type: "list",
          choices: departments,
        },
      ])
      .then((answers) => {
        connection.query(queries.addRoleQuery(depObj, answers), (err, res) => {
          console.log(`
Successfully added new role ${answers.role_title}!
                    `);
          init();
        });
      });
  });
};
