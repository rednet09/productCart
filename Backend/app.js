const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/products", require("./routes/products"));
app.use("/cart", require("./routes/cart"));
app.use("/checkout", require("./routes/checkout"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
