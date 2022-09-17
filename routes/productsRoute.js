const express = require("express");
const { body } = require("express-validator");
const productsController = require("../controllers/productsController");
const isAuth = require("../middleware/isAuth");

const route = express.Router();

//* GET
route.get("/product/:productId", productsController.getProduct);

//* POST
route.post(
  "/add_product",
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
  productsController.addProduct
);

//* PUT
route.put(
  "/edit_product/:productId",
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
  productsController.editProduct
);

//* DELETE
route.delete("/delete_product/:productId", isAuth, productsController.deleteProduct);

module.exports = route;
