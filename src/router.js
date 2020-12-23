const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const models = require("./models");
const formidable = require("formidable");
const url = require("url");

//      module imports end here      //

const Constants = require("./config");

//      service file imports end here      //

const UserController = require("./Controllers/Api/UserController");
const AreaController = require("./Controllers/Api/AreaController");
const ProductController = require("./Controllers/Api/ProductController");
const ImagesController = require("./Controllers/Api/ImagesController");
const SettingsController = require("./Controllers/Api/SettingsController");
const OrderController = require("./Controllers/Api/OrderController");
const AdminProductController = require("./Controllers/Admin/ProductController");
const AppUiController = require("./Controllers/Admin/AppUiController");
const CustomersController = require("./Controllers/Admin/CustomersController");
const DeliveryBoyController = require("./Controllers/Admin/DeliveryBoyController");
const NotificationController = require("./Controllers/Admin/NotificationController");
const TransactionController = require("./Controllers/Admin/TransactionController");
const AdminSettingsController = require("./Controllers/Admin/AdminSettingsController");
const AdminAreaController = require("./Controllers/Admin/AdminAreaController");
const AdminOrderController = require("./Controllers/Admin/AdminOrderController");

//      controller imports end here      //

//Database connection. Do not modify anything in this URL unless you know what you are doing.
mongoose.connect("mongodb://localhost:27017/" + Constants.DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(console.log("Connected!!"));



router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


/*

    Route handling below. Do not modify anything in the path. These are the API
    endpoints as well as admin panel endpoints. Changing anything can result in
    misbehaving or crashing of the application.


*/


// Admin panel routes

router.get("/home", (req, res) => {
    res.render("Dashboard/dashboard");
});

router.post("/add-product", AdminProductController.AddProduct);

router.post("/upload-slider-image", AppUiController.UploadSliderImage);

router.post("/upload-offer-image", AppUiController.UploadOfferImage);

router.get("/delete-offer-image", AppUiController.DeleteOfferImage);

router.get("/promo-codes", (req, res) => {
    models.promoCode.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("promo-codes", {data: result});
        }
    })
});

router.get("/featured-section", AppUiController.GetFeaturedSection);

router.get("/customers", CustomersController.GetCustomers);

router.get("/manage-customer-wallet", (req, res) => {
    res.render("customers/manage-customer-wallet");
});

router.post("/add-wallet", CustomersController.AddWallet);

router.post("/delete", (req, res) => {
    res.send("Deleted!!");
});

router.post("/add-promo-code", AdminProductController.AddPromoCode);

router.post("/add-featured-section", AppUiController.AddFeaturedSection);

router.get("/new-offer-images", AppUiController.GetNewOfferImages);

router.get("/payment-requests", (req, res) => {
    res.render("payment-requests");
});

router.get("/return-requests", (req, res) => {
    res.render("return-requests");
});

router.post("/add-delivery-boy", DeliveryBoyController.AddDeliveryBoy);

router.post("/manage-delivery-boys", DeliveryBoyController.ManageDeliveryBoy);

router.get("/delete-delivery-boy", DeliveryBoyController.DeleteDeliveryBoy);

router.get("/fund-transfers", (req, res) => {
    res.render("delivery-boys/fund-transfer");
});

router.get("/send-notification", NotificationController.RenderNotificationPage);

router.post("/send-message", NotificationController.SendNotification);

router.get("/transaction", TransactionController.GetTransactions);

router.get("/wallet-transactions", TransactionController.GetWalletTransaction);

router.get("/store-settings", AdminSettingsController.GetStoreSettings);

router.get("/payment-methods", AdminSettingsController.GetPaymentMethods);

router.get("/time-slots", AdminSettingsController.GetTimeSlots);

router.get("/notification-settings", (req, res) => {
    res.render("system/notification-settings");
});

router.get("/contact-us", (req, res) => {
    res.render("system/contact-us");
});

router.get("/privacy-policy", (req, res) => {
    res.render("system/privacy-policy");
});

router.get("/about-us", (req, res) => {
    res.render("system/about-us");
});

router.get("/cities", AdminAreaController.GetCities);

router.get("/areas", AdminAreaController.GetAreas);

router.get("/add-cities", (req, res) => {
    res.render("locations/add-city");
});

router.get("/add-areas", (req, res) => {
    models.city.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("locations/add-area", {data: result});
        }
    });
});

router.get("/categories", (req, res) => {
    var categories = models.category.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("categories", {data: result});
        }
    });
});

router.get("/sub-categories", (req, res) => {
    var subCategories = models.subCategory.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("sub-categories", {data: result});
        }
    });
});

router.get("/add-categories", (req, res) => {
    res.render("add-categories");
});

router.get("/add-sub-categories", (req, res) => {
    var categories = models.category.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("add-sub-categories", {data: result});
        }
    })
});

router.get("/units", (req, res) => {
    var units = models.unit.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("units", {data: result});
        }
    })
});

router.post("/update-settings", AdminSettingsController.UpdateSettings);

router.post("/update-payment-methods", AdminSettingsController.UpdatePaymentSettings);

router.post("/add-time-slots", AdminSettingsController.AddTimeSlots);

router.post("/update-fcm-key", (req, res) => {
    res.send("fcm key updated");
});

router.post("/update-contact-info", (req, res) => {
    res.send("contact info updated");
});

router.post("/update-privacy-policy", (req, res) => {
    res.send("privacy policy updated");
});

router.post("/update-about-us", (req, res) => {
    res.send("about us");
});

router.post("/add-city", AdminAreaController.AddCity);

router.post("/add-area", AdminAreaController.AddArea);

router.post("/add-category", AdminProductController.AddCategory);

router.post("/add-sub-category", AdminProductController.AddSubCategory);

router.post("/add-unit", AdminProductController.AddUnit);

router.get("/home-slider-images", (req, res) => {
    models.slider.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("app-images/home-slider-images", {data: result});
        }
    })
});

router.get("/add-product", (req, res) => {
    models.unit.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            models.category.find({}, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    models.subCategory.find({}, (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                        } else {
                            var information = {
                                unit: result,
                                category: result2,
                                subcategory: result3
                            }
                            res.render("Products/add-product", {data: information});
                        }
                    });
                }
            });
        }
    })
});

router.get("/product-orders", (req, res) => {
    res.render("Products/product-orders");
});

router.get("/manage-product", (req, res) => {
    models.product.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("Products/manage-product", {data: result});
        }
    });
});

router.get("/delete-slider-image", AppUiController.DeleteSliderImage);

router.get("/delete-category", AdminProductController.DeleteCategory);

router.get("/delete-sub-category", AdminProductController.DeleteSubCategory);

router.get("/delete-promo-code", AdminProductController.DeletePromoCode);

router.get("/delete-featured-section", AppUiController.DeleteFeaturedSection);

router.get("/edit-promo-code", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.promoCode.findById(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("edit-promo-code", {data: result});
        }
    })
});

router.post("/update-promo-code", AdminProductController.UpdatePromoCode);

router.get("/orders", (req, res) => {
    models.order.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("orders", {data: result});
        }
    });
});

router.get("/view-order", AdminOrderController.ViewOrder);

router.post("/update-order", AdminOrderController.updateOrder);

router.post("/delete-order", AdminOrderController.DeleteOrder);

router.get("/generate-invoice", AdminOrderController.GenerateInvoice);

router.get("/delete-city", AdminAreaController.DeleteCity);

router.get("/delete-area", AdminAreaController.DeleteArea);

router.get("/taxes", (req, res) => {
    models.taxes.find({}, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.render("taxes.ejs", {data: result});
        }
    });
});

router.get("/add-taxes", (req, res) => {
    res.render("add-taxes.ejs");
});

router.post("/add-tax", AdminProductController.AddTax);

router.get("/delete-tax", AdminProductController.DeleteTax);

router.get("/edit-tax", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.taxes.findById(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("edit-tax.ejs", {data: result});
        }
    });
});

router.post("/update-tax", AdminProductController.UpdateTax);

router.get("/delete-time-slot", AdminSettingsController.DeleteTimeSlots);


router.get("/manage-product", (req, res) => {
    res.render("Products/manage-product.ejs");
});

//Admin panel routes end here.

//API endpoints.

router.post("/api-firebase/get-categories", ProductController.getCategories);

router.post("/api-firebase/offer-images", ImagesController.getOfferImages);

router.post("/api-firebase/sections", ImagesController.getSections);

router.post("/api-firebase/slider-images", ImagesController.getSliderImages);

router.post("/api-firebase/user-registration", UserController.register);

router.post("/api-firebase/get-cities", AreaController.getCities);

router.post("/api-firebase/get-areas-by-city-id", AreaController.getAreaByCityID);

router.post("/api-firebase/login", UserController.login);

router.post("/api-firebase/get-user-data", UserController.getUserData);

router.post("/api-firebase/get-subcategories-by-category-id", ProductController.getSubCategoriesByCategoryID);

router.post("/api-firebase/get-products-by-subcategory-id", ProductController.getProductsBySubCategoryID);

router.post("/api-firebase/settings", SettingsController.getSettings);

router.post("/api-firebase/get-product-by-id", ProductController.getProductByID);

router.post("/api-firebase/order-process", OrderController.processOrder);

router.post("/api-firebase/validate-promo-code", OrderController.validatePromoCode);

router.post("/api-firebase/products-search", ProductController.search);

//API endpoints end here.

module.exports = router;
