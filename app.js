require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var mailconfig = require('./config/mail.config.js');

var transporter = nodemailer.createTransport({
    host: mailconfig.host,
    port: mailconfig.port,
    secure: mailconfig.secure,
    tls: {
      rejectUnauthorized: false
    }
  });


const app = express();

app.use(express.json());

app.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    // mail sending activity
    let rand=Math.floor((Math.random() * 100) + 54);
    let link="http://localhost"+"/verify?id="+rand;
    let mailOptions={
        from:process.env.FROM,
        to : req.body.email,
        subject : "Please confirm your Email account",
        html : `Hello,Please Click on the link to verify your email.<a>${link}</a> Click here to verify`
    }
    transporter.sendMail(mailOptions, function(err) {
    if(err){
        console.log("Error in mail",err);
    }
    console.log("Mail sent successfully");
    });

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
    } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

module.exports = app;