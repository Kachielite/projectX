const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");


//* Registration Endpoint
exports.register = async (req, res, next) => {
  let businessName = req.body.business_name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = new Error("Invalid User Input");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, 12);
    let user = new User();
    user.business_name = businessName;
    user.email = email;
    user.username = username;
    user.password = hashPassword;

    await user.save();

    return res.status(201).json({ message: "User successful created" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//* Sign In Endpoint
exports.signIn = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      let error = new Error("User with this email could not be found");
      error.statusCode = 404;
      throw error;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        "projectxsupertokenencryption",
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Login successful", token: token, userId: user._id.toString()});
    } else {
      let error = new Error("Incorrect Credentials");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
