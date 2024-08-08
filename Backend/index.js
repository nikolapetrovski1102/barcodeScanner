require('dotenv').config();
const express = require("express");
const app = express();

const Products = require('./Controller/Products');

const port = process.env.PORT;

app.get('/', Products.Test);
  
app.listen(port, () => {
console.log(`App listening at http://localhost:${port}`);
});