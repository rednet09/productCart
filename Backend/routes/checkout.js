const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
  const cart = await Cart.findOne({}).populate("items.productId");
  res.json(cart);
});

router.post("/pay", async (req, res) => {
  const { paymentMethodId } = req.body;
  const cart = await Cart.findOne({}).populate("items.productId");
  const amount = cart.items.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
    });

    cart.paymentIntentId = paymentIntent.id;
    await cart.save();

    if (
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "requires_source_action"
    ) {
      res.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
      });
    } else if (paymentIntent.status === "succeeded") {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Unexpected status" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
