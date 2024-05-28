import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  const addToCart = (productId) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/cart/add`, { productId })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price / 100}</p>
            <button onClick={() => addToCart(product._id)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
