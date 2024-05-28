import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/cart`)
      .then((response) => setCart(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cart ? (
        <div>
          <ul>
            {cart.items.map((item) => (
              <li key={item._id}>
                <h2>{item.productId.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>${item.productId.price / 100}</p>
              </li>
            ))}
          </ul>
          <Link to="/checkout">
            <button>Proceed to Checkout</button>
          </Link>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
