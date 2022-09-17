const mongoose = require('mongoose')
const Product = require("../model/products");
const User = require("../model/user");
const { validationResult } = require("express-validator");

//* Get Products
exports.getProducts = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const limitPerPage = 3;

    try {
        let userProducts = await User.findById(req.userId).populate('products')
        console.log(userProducts)
        let productPagination = userProducts.products.slice(((currentPage-1)*limitPerPage), limitPerPage*currentPage)
        res.status(200).json({"message":"All user products successfully fetched", products: productPagination})
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
    }

}

//* Add Product 
exports.addProduct = async (req, res, next) => {
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

    try {
      const newProduct = await product.save();
      let productOwner = await User.findById(req.userId);
      productOwner.products.push(newProduct._id.toString());
      await productOwner.save();
      return res.status(201).json({
        message: "Product successfully added",
        productId: newProduct._id.toString(),
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//* Get Product
exports.getProduct = async (req, res, next) => {
  let productId = req.params.productId;

  try {
    let product = await Product.findById(productId);
    if (!product) {
      let error = new Error("Product can not be found");
      error.statusCode = 404;
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Product successfully fetched", product: product });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//* Edit Product 
exports.editProduct = async (req, res, next) => {
  let productId = req.params.productId;
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

    let productToBeEdited = await Product.findById(productId);
    if (!productToBeEdited) {
      let error = new Error("Product can not be found");
      error.statusCode = 404;
      throw error;
    }
    if (productToBeEdited.product_owner.toString() !== req.userId) {
      let error = new Error(
        "Right to edit this product has been revoked because the product belongs to another user"
      );
      error.statusCode = 401;
      throw error;
    }
    productToBeEdited.name = name;
    productToBeEdited.description = description;
    productToBeEdited.category = category;
    productToBeEdited.price = parseInt(price);

    const editedProduct = await productToBeEdited.save();

    return res.status(200).json({
      message: "Product successfully edited",
      productId: editedProduct._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//* Delete Product
exports.deleteProduct = async (req, res, next) => {
  let productId = req.params.productId;

  try {
    let productToBeDeleted = await Product.findById(productId);
    if (!productToBeDeleted) {
      let error = new Error("Product can not be found");
      error.statusCode = 404;
      throw error;
    }
    if (productToBeDeleted.product_owner.toString() !== req.userId) {
      let error = new Error(
        "Right to delete this product has been revoked because the product belongs to another user"
      );
      error.statusCode = 401;
      throw error;
    }
    await Product.findByIdAndDelete(productToBeDeleted._id);
    let productOwner = await User.findById(req.userId);
    productOwner.products.pull(productId);
    await productOwner.save();
    return res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
