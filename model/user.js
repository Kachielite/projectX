const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    business_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    products:[{
      type: Schema.Types.ObjectId,
      ref: "Product",
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
