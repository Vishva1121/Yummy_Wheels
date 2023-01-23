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
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
},
category: {
    type: String
},
  gender: String,
  key:Number,
  img: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = new mongoose.model("User", userSchema);