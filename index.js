var app = require("express")();
var express = require("express");
var path = require("path");
var http = require("http").Server(app);
var bCrypt = require("bcryptjs");
var cors = require("cors");
var router = require("./src/router.js");
var Authrouter = require("./src/Authrouter.js");

// Access public folder from root
app.use("/public", express.static("public"));
app.get("/layouts/", function (req, res) {
    res.render("view");
});

// app.use(bodyParser.urlencoded({ extended : true }));
// Add Authentication Route file with app
app.use("/", Authrouter);
app.use(cors());

//For set layouts of html view
var expressLayouts = require("express-ejs-layouts");
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// Add Route file with app
// app.use("/home", router);
app.get("/", (req, res) => {
    res.redirect("/admin-login");
});
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
app.get("/units", router);
app.get("/delete-slider-image", router);
app.get("/delete-category", router);
app.get("/delete-sub-category", router);
app.get("/delete-promo-code", router);
app.get("/delete-featured-section", router);
app.get("/delete-delivery-boy", router);
app.get("/delete-offer-image", router);
app.get("/edit-promo-code", router);
app.get("/orders", router);
app.get("/view-order", router);
app.get("/testorder", router);
app.get("/testorderitem", router);
app.get("/delete-order", router);
app.get("/generate-invoice", router);
app.get("/delete-city", router);
app.get("/delete-area", router);
app.get("/taxes", router);
app.get("add-taxes", router);
app.get("/delete-tax", router);
app.get("/edit-tax", router);
app.get("/delete-time-slot", router);
app.get("/admin-login", Authrouter);
app.get("/home", router);
app.get("/add-product", router);
app.get("/manage-product", router);
app.get("/activate", Authrouter);
app.get("/zoom-meeting", router);
app.get("/get-zoom-details", router);
app.post("/admin-login", Authrouter);
app.post("/login", Authrouter);
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
app.post("/add-unit", router);
app.post("/update-promo-code", router);
app.post("/update-order", router);
app.post("/add-tax", router);
app.post("/update-tax", router);
app.post("/activate", Authrouter);
app.post("/api-firebase/get-categories", router);
app.post("/api-firebase/get-offer-images", router);
app.post("/api-firebase/sections", router);
app.post("/api-firebase/slider-images", router);
app.post("/api-firebase/user-registration", router);
app.post("/api-firebase/get-cities", router);
app.post("/api-firebase/get-areas-by-city-id", router);
app.post("/api-firebase/login", router);
app.post("/api-firebase/get-user-data", router);
app.post("/api-firebase/get-subcategories-by-category-id", router);
app.post("/api-firebase/get-products-by-subcategory-id", router);
app.post("/api-firebase/settings", router);
app.post("/api-firebase/get-product-by-id", router);
app.post("/api-firebase/order-process", router);
app.post("/api-firebase/validate-promo-code", router);
app.post("/api-firebase/products-search", router);
app.post("/api-firebase/get-all-data", router);
app.post("/delivery-boy", router);

app.post("/add-zoom", router);

app.post("/fetching", router);


http.listen(8000, function () {
    console.log("listening on *:8000");
});
