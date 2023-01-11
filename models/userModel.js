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
    },
    gender:String
  });
  
  userSchema.plugin(passportLocalMongoose);

  const userModel =  new mongoose.model("User", userSchema);

 const RestaurantSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    username:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    ownerName:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
 });

 RestaurantSchema.plugin(passportLocalMongoose);
 const restaurantModel = new mongoose.model("Restaurant", RestaurantSchema);  
 module.exports = {
  user: userModel,
  restaurant:restaurantModel
 }
  