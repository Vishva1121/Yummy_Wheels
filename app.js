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

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
})




// Restaurant-Part







// Customer-Part

app.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("index");
  }
  else {
    res.redirect("/register");
  }
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  User.register({ username: req.body.username, fname: req.body.fname, lname: req.body.lname, phoneNumber: req.body.phoneNumber }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    }
    else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
});

app.get("/login", function (req, res) {
  res.render("login");
});


app.post("/login",passport.authenticate("local", {
    failureRedirect: "/login",
    // failureFlash: true,
  }), (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout",function(req,res){
  req.logout(function(err){
      if(err){
          console.log(err);
      }
  });
  res.redirect("/");
});

















app.listen(3000, function () {
  console.log("Server started on port 3000.");
});







//password:gcyxmPAZtxzeEs56