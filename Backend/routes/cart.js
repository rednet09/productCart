const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.post("/add", async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne({});
  if (!cart) {
    cart = new Cart({ items: [] });
  }
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ productId });
  }
  await cart.save();
  res.json(cart);
});

router.get("/", async (req, res) => {
  const cart = await Cart.findOne({}).populate("items.productId");
  res.json(cart);
});

module.exports = router;
