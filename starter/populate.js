require("dotenv").config();

const connectDB = require("./db/connect");
const product = require("./models/products");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // Assuming connectDB takes the URI as an argument
    await product.deleteMany(); // deleting all products
    await product.create(jsonProducts);
    console.log("Success!!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
