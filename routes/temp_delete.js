var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
// require("dotenv").config();
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_HOST)
// const bcrypt = require("bcrypt");
// const express = require('express');
// const mysql = require('mysql');

  
// const connection = mysql.createConnection({
//   host: process.env.host,//"localhost"
//   user: "nitay",//"root"
//   password: "1607",
//   database:"mydb2",
// });

// // Connect to the database
// connection.connect((error) => {
//   if (error) {
//     console.error('Error connecting to the database: ', error);
//     return;
//   }

//   console.log('Connected to the database.');
// });
  // router.get("/",async (req, res) => {
  //   const recipes_id = await DButils.execQuery("SELECT * from users");

  //   res.send(recipes_id);
  //   // res.send("hi")
  //   // next();
  
  // });
  router.post("/", async (req, res,next) => {
    try {
      // parameters exists
      // valid parameters
      // username exists
      let user_details = {
        
        username: req.body.username
      }
      // console.log()
      console.log(user_details.username)
      let users = [];
      users = await DButils.execQuery("SELECT username from users");
  
      if (users.find((x) => x.username === user_details.username))
        throw { status: 409, message: "Username taken" };
  
      // add the new username
      
      await DButils.execQuery(
        `INSERT INTO users VALUES ('${user_details.username}')`
      );
      users = await DButils.execQuery("SELECT username from users");
  
      // if (users.find((x) => x.username === user_details.username))
      //   console.log("found you");
      res.status(201).send({ message: "user created", success: true });
    } catch (error) {
      next(error);
    }
  });
  // router.post('/', (req, res) => {
  //   // Extract the data from the request body
  //   const { username} = req.body;
  
  //   // Create an object with the data
  //   const data = {
  //     username
  //   };
  
  //   // Insert the data into the table
  //   connection.query('INSERT INTO users SET ?', data, (error, results, fields) => {
  //     if (error) {
  //       console.error('Error inserting data into table: ', error);
  //       res.status(500).json({ error: 'An error occurred while inserting data.' });
  //       return;
  //     }
  
  //     console.log('Data inserted successfully.');
  //     res.json({ message: 'Data inserted successfully.' });
  //   });
  // });
  module.exports = router;