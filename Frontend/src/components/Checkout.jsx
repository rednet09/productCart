import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function Checkout() {
  const [cart, setCart] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/checkout`)
      .then((response) => setCart(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handlePayment = async (event) => {
    event.preventDefault();
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (!error) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/checkout/pay`, {
          paymentMethodId: paymentMethod.id,
        })
        .then((response) => {
          if (response.data.requiresAction) {
            stripe
              .handleCardAction(response.data.clientSecret)
              .then((result) => {
                if (result.error) {
                  console.error(result.error.message);
                } else {
                  handlePayment(event);
                }
              });
          } else if (response.data.success) {
            console.log("Payment successful!");
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      {cart ? (
        <form onSubmit={handlePayment}>
          <ul>
            {cart.items.map((item) => (
              <li key={item._id}>
                <h2>{item.productId.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>${item.productId.price / 100}</p>
              </li>
            ))}
          </ul>
          <CardElement />
          <button type="submit">Pay</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Checkout;
