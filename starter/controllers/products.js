const Product = require("../models/products");

const getAllProductsStatic = async (req, res) => {
  //  retrieving all the products
  const products = await Product.find({}).sort("name price");

  // retrieving products with 'featured':true
  // const products = await Product.find({ featured: true });

  // getting outputs with only name & price
  // const products = await Product.find({}).select("name price");

  // sorts the results in descending order based on the "name" field
  // const products = await Product.find({}).sort("-name");

  // search = "a";
  // const products = await Product.find({
  //   // Using $regex to perform a regular expression search on the 'name' field
  //   name: { $regex: search, $options: "i" }, //$options : 'i' means case insensitive
  // });

  // filtering
  // const products = await Product.find({ price: { $gt: 30 } });

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  if (sort) {
    //seperating a comma seperated string into an array and then join it as an space seperated string
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
