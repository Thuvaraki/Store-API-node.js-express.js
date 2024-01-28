require("dotenv").config();
// async errors

const express = require("express");
const app = express();
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const connectDB = require("./db/connect");

app.get("/", (req, res) => {
  res.send(`<h1>Store API</h1><a href="/api/v1/products">products route</a>`);
});

//products route

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async (req, res) => {
  try {
    //connectDB
    connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening to the ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
