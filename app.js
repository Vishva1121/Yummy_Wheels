//jshint esversion:6
// require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require('express-flash');

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

passport.use(User.user.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.user.findById(id, function (err, user) {
    done(err, user);
  });
});




// Restaurant-Part


app.get("/registerRestaurant",function(req,res){
  res.render("registerRestaurant");
});

app.post("/registerRestaurant", function (req, res) {
  User.restaurant.register({ username: req.body.username, name: req.body.name, ownerName: req.body.oName, phoneNumber: req.body.phoneNumber, category : req.body.category, menu:{price:3,item:"Panner Tikka"} }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/registerRestaurant");
    }
    else {
      passport.authenticate("local")(req, res, function () {
        // genderAvatarDetail="/static/" + req.body.gender + "-avatar.png";
        res.redirect("/");
      });
    }
  });
});

app.get("/loginRestaurant", function (req, res) {
  res.render("loginRestaurant");
});


// app.post("/loginRestaurant", passport.authenticate("local", {
//   failureRedirect: "/loginRestaurant",
//   // failureFlash: true,
// }), (req, res) => {
//   res.redirect("/");
// }
// );








// Customer-Part

let genderAvatarDetail;

app.get("/", function (req, res) {

  if (req.isAuthenticated()) {
    console.log(req.user.id);
  res.render("index", { genderDetails: genderAvatarDetail});
  }
  else {
    res.redirect("/login");
  }
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  User.user.register({ username: req.body.username, fname: req.body.fname, lname: req.body.lname, phoneNumber: req.body.phoneNumber, gender: req.body.gender }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    }
    else {
      passport.authenticate("local")(req, res, function () {
        genderAvatarDetail="/static/" + req.body.gender + "-avatar.png";
        res.redirect("/");
      });
    }
  });
});

app.get("/login", function (req, res) {
  res.render("login");
});


app.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  // failureFlash: true,
}), (req, res) => {
  res.redirect("/");
  User.user.findOne({username:req.body.username},function(err,user){
    if(!err)
    {
      genderAvatarDetail="/static/" + user.gender + "-avatar.png";
    }
  });
}
);

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
});

















app.listen(3000, function () {
  console.log("Server started on port 3000.");
});







//password:gcyxmPAZtxzeEs56