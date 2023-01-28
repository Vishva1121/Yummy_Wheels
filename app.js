//jshint esversion:6
// require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const flash = require('express-flash');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://Vandit3804:gcyxmPAZtxzeEs56@cluster0.p0i6thj.mongodb.net/yummyWheelsDB", { useNewUrlParser: true });
mongoose.set('strictQuery', true);

const User = require('./models/userModel');
const Item = require('./models/items');
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const Storage = multer.diskStorage({
  destination:"./public/uploads",
  filename:(req,file,cb)=>{
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null,file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
});

const upload = multer({
  storage:Storage
});




// Restaurant-Part

app.get("/restaurantHome", function (req, res) {
  if (req.isAuthenticated() && req.user.key === 1) {
    Item.find({hotelId:req.user.id},function(err,items){
      res.render("restaurantHome", { genderDetails: "/uploads/"+req.user.img,fullName: req.user.name,items:items, homeLink:"/restaurantHome"});
    });
  }
  else {
    res.redirect("/");
  }
});

app.get("/registerRestaurant", function (req, res) {
  res.render("registerRestaurant");
});

app.post("/registerRestaurant", upload.single('file'), function (req, res) {
  User.register({ username: req.body.username, name: req.body.name, ownerName: req.body.oName, phoneNumber: req.body.phoneNumber, category: req.body.category, key: 1, img: req.file.filename}, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/registerRestaurant");
    }
    else {
      passport.authenticate("local")(req, res, function () {

        res.redirect("/restaurantHome");
      });
    }
  });
});

app.get("/loginRestaurant", function (req, res) {
  res.render("loginRestaurant");
});


app.post("/loginRestaurant", passport.authenticate("local", {
  failureRedirect: "/registerRestaurant",
  // failureFlash: true,
}), (req, res) => {
  genderAvatarDetail = "/static/male-avatar.png";
  res.redirect("/restaurantHome");
}
);

app.get("/addItem", function(req,res){
  res.render("addItem",{genderDetails: "/uploads/"+req.user.img,fullName:req.user.ownerName, homeLink:"/restaurantHome"})
});

app.post("/addItem",upload.single('file'),function(req,res){
  const item1= new Item({
    username:req.user.username,
    hotelId:req.user.id,
    name:req.body.name,
    quantity:req.body.quantity,
    price:req.body.price,
    category:req.body.category,
    img: req.file.filename
  });
  item1.save();
  res.redirect("/restaurantHome");
});









// Customer-Part

let genderAvatarDetail, user_id;
app.get("/", function (req, res) {
  if (req.isAuthenticated() && req.user.key === 0) {
    res.render("index", { genderDetails: genderAvatarDetail,fullName: req.user.name, homeLink:"/"});
  }
  else {
    res.redirect("/register");
  }
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  User.register({
    username: req.body.username, name: req.body.name, phoneNumber: req.body.phoneNumber, gender: req.body.gender, key:0}, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    }
    else {
      passport.authenticate("local")(req, res, function () {
        genderAvatarDetail = "/static/" + req.body.gender + "-avatar.png";
        res.redirect("/");
      });
    }
  });
});


app.post("/login", passport.authenticate("local", {
  failureRedirect: "/register",
  // failureFlash: true,
}), (req, res) => {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.redirect("/register");
    }
    else {
      genderAvatarDetail = "/static/" + user.gender + "-avatar.png";
    }
  });
  res.redirect("/");
}
);

app.get("/category/:customCategory", function (req, res) {
  // console.log(req.params.customCategory);
  User.find({ category: req.params.customCategory }, function (err, restaurants) {
    res.render("restaurantList", { genderDetails: genderAvatarDetail, restaurantType: req.params.customCategory, restaurants: restaurants, fullName:req.user.name, homeLink:"/"})
  })
});


app.get("/restaurants/:customRestaurant",function(req,res){
  console.log(req.params.customRestaurant);
  res.redirect("/");
});


app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/registerRestaurant");
});


//Edit Part

app.get("/editProfile",function(req,res){
  if(req.isAuthenticated() && req.user.key===0){
    res.render("editProfile",{genderDetails:genderAvatarDetail, fullName:req.user.name,user:req.user, homeLink:"/"}); 
  }
  else
  {
    res.render("editProfile",{genderDetails:"/uploads/"+req.user.img, fullName:req.user.name,user:req.user, homeLink:"/restaurantHome"});
  }
});

app.post("/editProfile",function(req,res){
  User.updateOne({_id:req.user.id},{name:req.body.name,username:req.body.username,phoneNumber:req.body.phoneNumber,birthDate:req.body.birthDate},function(err){
    if(!err)
    {
      res.redirect("/editProfile");
    }
  });
})

















app.listen(3000, function () {
  console.log("Server started on port 3000.");
});







//password:gcyxmPAZtxzeEs56