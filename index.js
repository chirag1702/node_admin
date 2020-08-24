var app = require("express")();
var express = require("express");
var path = require("path");
var http = require("http").Server(app);
var bCrypt = require("bcryptjs");
var bodyParser = require("body-parser");

var router = require("./router.js");
var Authrouter = require("./Authrouter.js");

// Access public folder from root
app.use("/public", express.static("public"));
app.get("/layouts/", function(req, res) {
  res.render("view");
});

// Add Authentication Route file with app
app.use("/", Authrouter);

//For set layouts of html view
var expressLayouts = require("express-ejs-layouts");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// Add Route file with app
app.use("/", router);
// app.get("/", router);
app.get("/pages-login-2", router);
app.get("/home-slider-images", router);
app.get("/new-offer-images", router);
app.get("/promo-codes", router);
app.get("/featured-section", router);
app.get("/customers", router);
app.get("/manage-customer-wallet");
app.get("/payment-requests", router);
app.get("/return-requests", router);
app.get("/manage-delivery-boys", router);
app.get("/fund-transfers", router);
app.get("/send-notification", router);
app.get("/transaction", router);
app.get("/wallet-transactions", router);
app.get("/store-settings", router);
app.get("/payment-methods", router);
app.get("/time-slots", router);
app.get("/notification-settings", router);
app.get("/contact-us", router);
app.get("/privacy-policy", router);
app.get("/about-us", router);
app.get("/cities", router);
app.get("/areas", router);
app.get("/add-cities", router);
app.get("/add-areas", router);
app.get("/categories", router);
app.get("/sub-categories", router);
app.get("/add-categories", router);
app.get("/add-sub-categories", router);
app.post("/login", router);
app.post("/add-variation", router);
app.post("/add-product", router);
app.post("/delete", router);
app.post("/upload-slider-image", router);
app.post("/upload-offer-image", router);
app.post("/add-promo-code", router);
app.post("/add-featured-section", router);
app.post("/add-wallet", router);
app.post("/add-delivery-boy", router);
app.post("/send-message", router);
app.post("/update-settings", router);
app.post("/update-payment-methods", router);
app.post("/add-time-slots", router);
app.post("/update-fcm-key", router);
app.post("/update-contact-info", router);
app.post("/update-privacy-policy", router);
app.post("/update-about-us", router);
app.post("/add-city", router);
app.post("/add-area", router);
app.post("/add-category", router);
app.post("/add-sub-category", router);


http.listen(8000, function() {
  console.log("listening on *:8000");
});
