const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema({
  items: [CartItemSchema],
  paymentIntentId: String,
});

module.exports = mongoose.model("Cart", CartSchema);
