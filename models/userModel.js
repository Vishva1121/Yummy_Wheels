const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      // required: true
    },
    fname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  });
  
  userSchema.plugin(passportLocalMongoose);
  
  module.exports = new mongoose.model("User", userSchema);
  