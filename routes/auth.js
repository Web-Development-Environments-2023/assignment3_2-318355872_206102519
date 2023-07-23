var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");


router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
      profilePic: req.body.profilePic
    }
    
    let users = [];
    users = await DButils.execQuery("SELECT username from users");

    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users VALUES (default,'${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
      '${user_details.country}', '${hash_password}', '${user_details.email}','${user_details.profilePic}')`
    );
    //checking that the element insereted (temporal solution for the problem )
    DButils.execQuery("SELECT username from users");

    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});
/**function to check if the username it exists or not **/
router.get('/Register', async (req, res) => {
  let UserNameTaken = false;
  try{
    const users = await DButils.execQuery("SELECT username FROM users");
    if (users.find((x) => x.username === req.query.username))
    {
      UserNameTaken = true;
    }
    res.status(200).send({ UserNameTaken:UserNameTaken})
    console.log(UserNameTaken)
  }catch (error) {
    res.status(200).send({ UserNameTaken:UserNameTaken})
    console.log(UserNameTaken)
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];
      console.log(user)
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }
    console.log(user.user_id)
    // Set cookie
    req.session.user_id = user.user_id;
    


    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
    console.log(req.session)
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  console.log(req.session)
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});


module.exports = router;