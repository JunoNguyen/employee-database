const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_db'
    },
);

db.connect(function (err){
    if (err) throw err;
    database();
})

const choices = [
    {
        type: 'list',
        name:'options',
        message: 'What would you like to do?',
        choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Quit'
        ]
          
      }
];

const database = function() {
    inquirer.prompt(choices)
    .then(function ({ options }) {
        switch (options) {
            case "View All Employees":
                employeeAll();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "View All Roles":
                roleAll();
                break;
            case "View All Departments":
                departmentAll();
                break;
            case "Add Role":
                addRole();
                break;
        }
    })
};

const employeeAll = function() {
    console.log('Viewing All Employees')
    const employees = `SELECT * FROM employee`

    db.query(employees, function (err, res) {
        if (err) throw err;
    
        console.table(res);

        database();
    });
};

const roleAll = function() {
    console.log('Viewing All Roles')
    const roles = `SELECT * FROM roles`

    db.query(roles, function (err, res) {
        if (err) throw err;
    
        console.table(res);

        database();
    });
};

const departmentAll = function() {
    console.log('Viewing All Departments')
    const department = `SELECT * FROM department`

    db.query(department, function (err, res) {
        if (err) throw err;
    
        console.table(res);

        database();
    });
};

const addEmployee = function() {
    let employee = 
    `SELECT 
        roles.id, 
        roles.title, 
        roles.salary 
    FROM roles`

 db.query(employee,(err, res)=>{
    if(err)throw err;
    const role = res.map(({ id, title, salary }) => ({
      value: id, 
      title: `${title}`, 
      salary: `${salary}`
    }));

    console.table(res);
    employeeRoles(role);
  });
};
  
const employeeRoles = function(role) {
  inquirer
    .prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's name?"
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?"
    },
    {
      type: "list",
      name: "roleId",
      message: "What is the employee's role?",
      choices: role
    }
  ]).then((newEmployee)=>{
      let employee = `INSERT INTO employee SET ?`
      db.query(employee,{
        first_name: newEmployee.firstName,
        last_name: newEmployee.lastName,
        role_id: newEmployee.roleId
      },(err)=>{
        if(err) throw err;
        database();
    });
  });
};

const updateEmployee = function(){
    let updateEmployee = `SELECT employee.employee_id, employee.first_name, employee.last_name FROM employee`
  
    db.query(updateEmployee,(err, res)=>{
      if(err)throw err;
      const employee = res.map(({ id, first_name, last_name }) => ({
        value: id,
         name: `${first_name} ${last_name}`      
      }));
      console.table(res);
      updateRole(employee);
    });
};

function updateRole(employee){
  let query = 
  `SELECT 
    roles.id, 
    roles.title, 
    roles.salary 
  FROM roles`

  db.query(query,(err, res)=>{
    if(err)throw err;
    let roleChoices = res.map(({ id, title, salary }) => ({
      value: id, 
      title: `${title}`, 
      salary: `${salary}`      
    }));
    console.table(res);
    getUpdatedRole(employee, roleChoices);
  });
};

const getUpdatedRole = function(employee, roleChoices) {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: `Employee who's role will be Updated: `,
          choices: employee
        },
        {
          type: "list",
          name: "role",
          message: "Select New Role: ",
          choices: roleChoices
        },
  
      ]).then((res)=>{
        let updatedEmployee = `UPDATE employee SET role_id = ? WHERE employee_id = ?`
        db.query(updatedEmployee,[ res.roles, res.employee],(err, res)=>{
            if(err)throw err;
            database();
          });
      });
};

const addRole = function() {
    let department = 
    `SELECT 
        department.id, 
        department.title
    FROM department`

 db.query(department,(err, res)=>{
    if(err)throw err;
    const department = res.map(({ id, title }) => ({
      value: id, 
      title: `${title}`, 
    }));

    console.table(res);
    newRole(department);
  });
}
  
const newRole = function(department) {
  inquirer
    .prompt([
    {
      type: "input",
      name: "roleName",
      message: "What is the role's title?"
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the role's salary?"
    },
    {
      type: "list",
      name: "departmentId",
      message: "What is the role's department?",
      choices: department
    }
  ]).then((newRole)=>{
      let role = `INSERT INTO roles SET ?`
      db.query(role,{
        title: newRole.roleName,
        salary: newRole.roleSalary,
        department: newRole.departmentId
      },(err)=>{
        if(err) throw err;
        database();
    });
  });
};