const Product = require("../model/products");
const { validationResult } = require("express-validator");

exports.add_new_product = async (req, res, next) => {
  let name = req.body.name;
  let description = req.body.description;
  let category = req.body.category;
  let price = req.body.price;

  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let err = new Error("Invalid User Input");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const product = new Product();
    product.name = name;
    product.description = description;
    product.category = category;
    product.price = parseInt(price);
    product.product_owner = req.userId;

    const newProduct = await product.save();

    return res
      .status(201)
      .json({
        message: "Product successfully added",
        productId: newProduct._id.toString(),
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
