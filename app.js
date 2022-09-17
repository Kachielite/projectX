const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const authenticationRoute = require("./routes/authenticationRoute");
const productsRoute = require("./routes/productsRoute");

dotenv.config();
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    let error = new Error(
      "Unsupported Image format. PNG, JPG, JPEG are supported only"
    );
    error.statusCode = 422;
    throw error;
  }
};

//Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: fileStorage, fileFilter: filter }).single('image'));

//route
app.use("/v1", authenticationRoute);
app.use("/v1", productsRoute);

app.use((error, req, res, next) => {
  let statusCode = error.statusCode;
  let message = error.message;
  let data = error.data;
  return res.status(statusCode).json({ message: message, errors: data });
});

mongoose
  .connect(
    `mongodb+srv://projectx:${process.env.MONGODBPASSWORD}@cluster0.vp0vvvd.mongodb.net/projectx?retryWrites=true&w=majority`
  )
  .then((results) => {
    app.listen(3001, () => {
      console.log(
        "Connection to DB successful...Server is listening on port 3001.."
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
