const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql-725ccaa-aayushjadhav0714-09ac.j.aivencloud.com',
  port: 15574,
  user: 'avnadmin',
  password: 'AVNS_3cvjMgTfZPjbzm0e9Uy', // Tu dilela password
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

connection.connect((err) => {
  if (err) {
    console.error("Connection error: " + err.message);
    return;
  }
  console.log("Aiven Database Connected!");
// setup.js cha table creation wala bhag asava:
const createTableQuery = `CREATE TABLE IF NOT EXISTS reports (id INT AUTO_INCREMENT PRIMARY KEY, fullname VARCHAR(255), mobile VARCHAR(20), disasterType VARCHAR(100), datetime VARCHAR(100), location VARCHAR(255), description TEXT);`;
db.query(createTableQuery, (err) => { /* logic */ });

// Mag ha code db.query vaprun run kela pahije
db.query(createReportsTable, (err) => {
    if (err) console.log("Error creating table:", err);
    else console.log("Reports table ready with fullname column!");
});
  // Query 1: Users Table
  const userTable = `CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  );`;

  // Query 2: Reports Table
  const reportTable = `CREATE TABLE IF NOT EXISTS reports (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
  );`;

  connection.query(userTable, (err) => {
    if (err) console.error("User table error: ", err.message);
    else console.log("Users table ready!");

    connection.query(reportTable, (err) => {
      if (err) console.error("Report table error: ", err.message);
      else console.log("Reports table ready!");
      
      console.log("Setup Complete! Aata tumhi backend deploy karu shakta.");
      connection.end();
    });
  });
});
