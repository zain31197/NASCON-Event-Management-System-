// db/connection.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Use your MySQL username
  password: 'zain3119', // Use your MySQL password
  database: 'project_iteration2' // my data base nam
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

module.exports = connection;
