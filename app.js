require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var mailconfig = require('./config/mail.config.js');

const users=require('./routes/users.js');
const product=require('./routes/products.js');




const app = express();
app.use(express.json({ extended: false }));




app.use('/',users);
app.use('/product',product);



module.exports = app;