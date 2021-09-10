require("dotenv").config();
require("../config/database").connect();
const express = require("express");
const User = require("../model/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var mailconfig = require('../config/mail.config');
const auth = require("../middleware/auth");
const product = require("../model/product");
const app = express();
var transporter = nodemailer.createTransport({
    host: mailconfig.host,
    port: mailconfig.port,
    secure: mailconfig.secure,
    tls: {
      rejectUnauthorized: false
    }
  });
  var rand=Math.floor((Math.random() * 100) + 54);
  var link="http://localhost:"+process.env.API_PORT+"/verify?id="+rand;
  console.log(link);
  var host="localhost";
  
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
      email: email.toLowerCase(), 
      password: encryptedPassword,
      rand:rand
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
    var mailOptions={
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
    const active=await User.find({email:email},{active:1});
    console.log(active);
    if(active[0].active==false){
      res.status(401).send("User is not verified");
    }
    else{
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
    }
    // Validate if user exist in our database
    
    } catch (err) {
    console.log(err);
  }
});

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome to Product DashBoard After Successfull Authentication ,Now please assign products🙌 ");
});
app.post("/user/product", auth, async(req, res) => {
  try
  {
    const products=req.body;
    const userId=req.body._id;
    const productId=req.body.productId;

    await User.findByIdAndUpdate(userId,
      {$push: {products:productId}},
      {new: true,safe:true,upsert:true},
      (err,doc)=>{
        if(err){
          console.log(err);
        }
        else{
          res.status(200).send("Product Added SUccessfully🙌 ");
        }
      }
      )
  } catch (err) {
    console.log(err);
  }
  


});
app.get("/verify",async (req,res)=>{
  // console.log("random",req.query.id);
  // console.log("protocol",req.protocol);
  // console.log("host",req.hostname);
  // console.log("host",rand);
  if((req.protocol+"://"+req.hostname)==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        let user= await User.updateOne({rand:rand},{$set:{
          active:true
        }
        
    });
    console.log(user);
        res.end("Email is been Successfully verified");

    }
    else
    {
        console.log("email is not verified");
        res.end("Bad Request");
    }
}
else
{
    res.end("Request is from unknown source");
    res.next();
}

});
app.post("/user/getProductByUserId/:id",async (req,res)=>{
  const id=req.params.id;

  const response=await User.find({_id:id},{products:1});
  const products=response[0].products;
  const res1=await product.find({_id:
  {
    "$in":products
  }
  })
  console.log(res);
  res.status(200).send(res1);
});

module.exports = app;