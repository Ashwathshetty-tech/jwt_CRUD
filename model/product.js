const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId:{type: String, unique: true},
  name: { type: String, default: null },
  brand: { type: String, default: null },
  category: { type: String, default: null }
});

module.exports = mongoose.model("product", productSchema);