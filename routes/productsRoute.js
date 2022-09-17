const express = require("express");
const { body } = require("express-validator");
const productsController = require("../controllers/productsController");
const isAuth = require("../middleware/isAuth");

const route = express.Router();

route.put(
  "/add_new_product",
  isAuth,
  [
    body("name").not().isEmpty().withMessage("Product name is required").trim(),
    body("description")
      .not()
      .isEmpty()
      .withMessage("Product description is required")
      .trim(),
    body("category")
      .not()
      .isEmpty()
      .withMessage("Product description is required")
      .trim(),
    body("price")
      .not()
      .isEmpty()
      .withMessage("Product price is required")
      .trim(),
  ],
  productsController.add_new_product
);

module.exports = route;
