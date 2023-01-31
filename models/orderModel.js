const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
username: {
    type: String,
    required: true
  },
name: {
    type: String,
    required: true
  },
price:{
    type: String
},
category:{
    type:String
},
quantity:String,
img: String,
date:Date
});

userSchema.plugin(passportLocalMongoose);
module.exports = new mongoose.model("User", userSchema);