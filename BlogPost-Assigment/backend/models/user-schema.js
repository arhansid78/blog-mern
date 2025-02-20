const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: [3, "username atleast 3 character"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: [10, "username atleast 10 character"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [6, "username atleast 6 character"],
  },
});

const user = mongoose.model("user", userSchema);
module.exports = user;
