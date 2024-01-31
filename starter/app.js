require("dotenv").config();
require("express-async-errors"); // async errors

const express = require("express");
const app = express();
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const connectDB = require("./db/connect");
const productRoutes = require("./routes/products");

app.get("/", (req, res) => {
  res.send(`<h1>Store API</h1><a href="/api/v1/products">products route</a>`);
});

app.use("/api/v1/products", productRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async (req, res) => {
  try {
    //connectDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening to the ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
