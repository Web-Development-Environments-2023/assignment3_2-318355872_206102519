const express = require('express');
const mysql = require('mysql');

// Create an Express.js app
const app = express();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.host,//"localhost"
  user: "nitay",//"root"
  password: "1607",
  database:"mydb2",
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database: ', error);
    return;
  }

  console.log('Connected to the database.');
});

// Parse JSON bodies for POST requests
app.use(express.json());

// Define a POST route for inserting data into the table
app.post('/insert', (req, res) => {
  // Extract the data from the request body
  const { username} = req.body;

  // Create an object with the data
  const data = {
    username
  };

  // Insert the data into the table
  connection.query('INSERT INTO users SET ?', data, (error, results, fields) => {
    if (error) {
      console.error('Error inserting data into table: ', error);
      res.status(500).json({ error: 'An error occurred while inserting data.' });
      return;
    }

    console.log('Data inserted successfully.');
    res.json({ message: 'Data inserted successfully.' });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
