const express = require("express");
const Authrouter = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const models = require("./models");
const AdminController = require("./Controllers/Admin/AdminController")
const AuthFile = require("../public/js/pages/Auth-folder/AuthFile")

mongoose.connect("mongodb://localhost:27017/ekart_DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(console.log("Connected!!"));


Authrouter.use(bodyParser.json());
Authrouter.use(bodyParser.urlencoded({extended: true}));


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

Authrouter.get("/activate", function (req, res) {
    res.render("Authentication/activate");
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

Authrouter.get("/admin-login", function (req, res) {
    // res.render("Authentication/login");
    let info = {
        error: false
    };

   res.render("Authentication/pages-login", {data: info});
});

Authrouter.post("/login", AdminController.AdminLogin);

module.exports = Authrouter;
