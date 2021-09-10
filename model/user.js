const mongoose = require("mongoose");

var productId={type:String,required:false}
const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  active:{type:Boolean,default: false},
  rand:{type:String, default: null},
  token: { type: String },
  products:[
   productId
  ]
});


module.exports = mongoose.model("user", userSchema);