const express = require("express");
const Authrouter = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const models = require("./models");

mongoose.connect("mongodb://localhost:27017/ekart_DB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(console.log("Connected!!"));



Authrouter.use(bodyParser.json());
Authrouter.use(bodyParser.urlencoded({ extended: true }));


//Authentications all TABs.
Authrouter.get("/pages-login", function (req, res) {
    res.render("Authentication/pages-login");
});
Authrouter.get("/pages-404", function (req, res) {
    res.render("Authentication/pages-404");
});
Authrouter.get("/pages-500", function (req, res) {
    res.render("Authentication/pages-500");
});

Authrouter.get("/pages-comingsoon", function (req, res) {
    res.render("Authentication/pages-comingsoon");
});
Authrouter.get("/pages-lock-screen", function (req, res) {
    res.render("Authentication/pages-lock-screen");
});
Authrouter.get("/pages-lock-screen-2", function (req, res) {
    res.render("Authentication/pages-lock-screen-2");
});
// Authrouter.get("/", function (req, res) {
//     res.render("Authentication/login");
// });
Authrouter.get("/pages-maintenance", function (req, res) {
    res.render("Authentication/pages-maintenance");
});

Authrouter.get("/pages-recoverpw", function (req, res) {
    res.render("Authentication/pages-recoverpw");
});
Authrouter.get("/pages-recoverpw-2", function (req, res) {
    res.render("Authentication/pages-recoverpw-2");
});
Authrouter.get("/pages-register", function (req, res) {
    res.render("Authentication/pages-register");
});
Authrouter.get("/pages-register-2", function (req, res) {
    res.render("Authentication/pages-register-2");
});

Authrouter.post("/admin-login", function (req, res) {
    var username = req.body.username;
    var password = req.body.userpassword;
    if (!username || !password) {
        var error = "All fields are required!!";
        res.redirect("/", { data: error});
    }
    res.send("login!!");
});

module.exports = Authrouter;
