require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool (better than a single connection for web apps)
const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    // host: "localhost",
    // user: "root",
    // password: "root",
    // database: "rescue_circle"
});

// Connect to MySQL
dbConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
    }
  });
  
  // Export the connection object
module.exports = dbConnection;
