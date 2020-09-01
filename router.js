const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const parse = require('querystring');
const mongoose = require("mongoose");
const models = require("./models");
const fs = require("file-system");
const multer = require("multer");
const { count } = require("console");
const formidable = require("formidable");
const multiparty = require("multiparty");


mongoose.connect("mongodb://localhost:27017/ekart_DB", { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log("Connected!!"));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post("/add-variation", (req, res) => {
    res.render("./views/Forms/form-elements.ejs", { "additionData": variationData });
});

router.post("/add-product", (req, res) => {
    res.send("Added!!");
});

router.post("/upload-slider-image", (req, res) => {
    // var type = req.body.type;
    // var imagePath;
    // var form = new formidable.IncomingForm();
    // form.parse(req);
    // form.on("fileBegin", (name, file) => {
    //     file.path = __dirname + "/uploads/" + file.name;
    //     imagePath = "./uploads/" + file.name;
    // });
    // form.on("file", (name, file) => {
    //     console.log("Uploaded" + imagePath);
    // });

    // console.log(imagePath);

    // var sliderImage = models.slider({
    //     type: type,
    //     type_id: "typeid",
    //     image: imagePath
    // });

    // sliderImage.save((err, result) => {
    //     if (err) {
    //         console.log(err);
    //     }

    //     else {
    //         res.redirect("home-slider-images");
    //     }
    // });

    var form = new multiparty.Form();
    form.parse(req);

    form.on('part', function (part) {
        // You *must* act on the part by reading it
        // NOTE: if you want to ignore it, just call "part.resume()"

        if (!part.filename) {
            // filename is not defined when this is a field and not a file
            console.log('got field named ' + part.name);
            // ignore field's content

        }

        if (part.filename) {
            // filename is defined when this is a file
            count++;
            console.log('got file named ' + part.name);
            // ignore file's content here
            part.resume();
        }

        part.on('error', function (err) {
            // decide what to do
        });
    });

    res.send("Under Construnction");
});

router.post("/upload-offer-image", (req, res) => {
    res.send("Offer Image Uploaded!!");
});

router.get("/promo-codes", (req, res) => {
    models.promoCode.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("promo-codes", { data: result });
        }
    })
});

router.get("/featured-section", (req, res) => {
    models.section.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("featured-section", { data: result });
        }
    })
});

router.get("/customers", (req, res) => {
    res.render("customers/customers");
});

router.get("/manage-customer-wallet", (req, res) => {
    res.render("customers/manage-customer-wallet");
});

router.post("/add-wallet", (req, res) => {
    var customerName = req.body.customer;
    var txnType = req.body.type;
    var amount = req.body.amount;
    var message = req.body.message;
    var newAmount;
    var oldAmount;
    models.user.findOne({ name: customerName }).select("balance -_id").exec((err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            oldAmount = result.balance;
            console.log(oldAmount);
            if (txnType == "credit") {
                newAmount = (oldAmount - 0) + (amount - 0); //subtraction is done because js don't support addition
                models.user.updateOne({ name: customerName }, { $set: { balance: newAmount } }, (err, doc) => {
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log(doc);
                    }
                });
            }

            else if (txnType == "debit") {
                newAmount = oldAmount - amount;
                models.user.updateOne({ name: customerName }, { $set: { balance: newAmount } }, (err, docu) => {
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log(docu);
                    }
                });
            }
        }

        var transaction = models.walletTransaction({
            user_id: result.id,
            type: txnType,
            amount: amount,
            message: message,
            status: result.status,
            date_created: Date.now(),
            last_updated: Date.now(),
        });

        transaction.save((err, resul) => {
            if (err) {
                console.log(err);
            }

            else {
                res.redirect("manage-customer-wallet");
            }
        });

    });


});

router.post("/delete", (req, res) => {
    res.send("Deleted!!");
});

router.post("/add-promo-code", (req, res) => {
    var code = req.body.promocode;
    var message = req.body.message;
    var startDate = req.body.startdate;
    var endDate = req.body.enddate;
    var noOfUsers = req.body.noofusers;
    var minOrderAmount = req.body.minorderamt;
    var discount = req.body.discount;
    var discountType = req.body.discounttype;
    var maxDiscount = req.body.discount;
    var repeat = req.body.repeat;
    var repeat_code = 0;
    var status_code = 0;
    var status = req.body.status;
    var promoCodeID = 0;
    models.promoCode.find({}).sort({ _id: -1 }).limit(1).exec((err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            promoCodeID = result.code_id + 1;
        }
    });

    if (repeat == "Allowed") {
        repeat_code = 1;
    }

    else if (repeat == "Not Allowed") {
        repeat_code = 0;
    }

    if (status == "Active") {
        status_code = 1;
    }

    else if (status == "Deactive") {
        status_code = 0;
    }

    var promoCode = models.promoCode({
        promo_code: code,
        message: message,
        start_date: startDate,
        end_date: endDate,
        no_of_users: noOfUsers,
        minimum_order_amount: minOrderAmount,
        discount: discount,
        discount_type: discountType,
        max_discount_amount: maxDiscount,
        repeat_usage: repeat_code,
        status: status_code,
        date_created: Date.now(),
        code_id: promoCodeID,
    });

    promoCode.save((err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.redirect("promo-codes");
        }
    });
});

router.post("/add-featured-section", (req, res) => {
    var sectionTitle = req.body.title;
    var sectionDescription = req.body.description;
    var sectionStyle = req.body.style;
    var productIDS = req.body.productids;
    var featuredSection = models.section({
        title: sectionTitle,
        short_description: sectionDescription,
        style: sectionStyle,
        product_ids: productIDS,
        date_created: Date.now()
    });

    featuredSection.save((err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.redirect("featured-section");
        }
    });
});

router.get("/new-offer-images", (req, res) => {
    res.render("app-images/new-offer-images");
});

router.get("/payment-requests", (req, res) => {
    res.render("payment-requests");
});

router.get("/return-requests", (req, res) => {
    res.render("return-requests");
});

router.post("/add-delivery-boy", (req, res) => {
    res.send("delivery boy added!!");
});

router.get("/manage-delivery-boys", (req, res) => {
    res.render("delivery-boys/manage-delivery-boys");
});

router.get("/fund-transfers", (req, res) => {
    res.render("delivery-boys/fund-transfer");
});

router.get("/send-notification", (req, res) => {
    res.render("send-notification");
});

router.post("/send-message", (req, res) => {
    res.send("message sent!!");
});

router.get("/transaction", (req, res) => {
    res.render("transaction");
});

router.get("/wallet-transactions", (req, res) => {
    models.walletTransaction.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("wallet-transactions", {data: result});
        }
    });
});

router.get("/store-settings", (req, res) => {
    models.setting.find({}).sort({ _id: -1 }).limit(1).exec((err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("settings", { data: result });
        }
    });
});
router.get("/payment-methods", (req, res) => {
    res.render("system/payment-methods");
});

router.get("/time-slots", (req, res) => {
    res.render("system/time-slots");
});

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

router.get("/cities", (req, res) => {
    res.render("locations/cities");
});

router.get("/areas", (req, res) => {
    res.render("locations/areas");
});

router.get("/add-cities", (req, res) => {
    res.render("locations/add-city");
});

router.get("/add-areas", (req, res) => {
    res.render("locations/add-area");
});

router.get("/categories", (req, res) => {
    var categories = models.category.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("categories", { data: result });
        }
    });
});

router.get("/sub-categories", (req, res) => {
    var subCategories = models.subCategory.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("sub-categories", { data: result });
        }
    });
});

router.get("/add-categories", (req, res) => {
    models.find((err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("Products/add-product", { data: result });
        }
    });
});

router.get("/add-sub-categories", (req, res) => {
    var categories = models.category.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("add-sub-categories", { data: result });
        }
    })
});

router.get("/units", (req, res) => {
    var units = models.unit.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("units", { data: result });
        }
    })
});

router.post("/update-settings", (req, res) => {

    // models.setting.countDocuments().then(count => {
    //     if (count >= 1) {
    //         models.setting.deleteMany({}, (err, result) => {
    //             if (err) {
    //                 console.log(err);
    //             }

    //             else {
    //                 console.log("cleared!!");
    //             }
    //         })
    //     }
    // }).catch(err => {
    //     console.log(err);
    // });


    var appName = req.body.appname;
    var supportNumber = req.body.supportnumber;
    var supportEmail = req.body.supportemail;
    var currentversion = req.body.currentversion;
    var minversion = req.body.minversion;
    var currency = req.body.currency;
    var gst = req.body.gst;
    var cgst = req.body.cgst;
    var sgst = req.body.sgst;
    var igst = req.body.igst;
    var deliverychargeamt = req.body.deliverychargeamt;
    var minfreedelivery = req.body.minfreedelivery;
    var timezone = req.body.timezone;
    var minreferamt = req.body.minreferamt;
    var referbonus = req.body.referbonus;
    var refermethod = req.body.refermethod;
    var maxreferamt = req.body.maxreferamt;
    var minwithdrawamt = req.body.minwithdrawamt;
    var maxreturndays = req.body.maxreturndays;
    var deliveryboybonus = req.body.deliveryboybonus;
    var fromemail = req.body.fromemail;
    var replyemail = req.body.replyemail;
    var setting = models.setting({
        app_name: appName,
        support_number: supportNumber,
        support_email: supportEmail,
        current_version: currentversion,
        min_version: minversion,
        currency: currency,
        gst: gst,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        delivery_charge: deliverychargeamt,
        min_free_delivery_amount: minfreedelivery,
        system_time_zone: timezone,
        refer_and_earn_enable: 0,
        min_refer_and_earn_amount: minreferamt,
        refer_and_earn_bonus: referbonus,
        refer_and_earn_method: refermethod,
        max_refer_and_earn_amount: maxreferamt,
        min_withdraw_amount: minwithdrawamt,
        max_days_to_return_item: maxreturndays,
        delivery_boy_bonus: deliveryboybonus,
        from_email: fromemail,
        reply_to_email: replyemail
    });
    setting.save(function (err, result) {
        if (err) {
            console.log(err);
        }

        else {
            res.redirect("store-settings");
        }
    });
});

router.post("/update-payment-methods", (req, res) => {
    res.send("payment method updated!!");
});

router.post("/add-time-slots", (req, res) => {
    res.send("time slot added!!");
});

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

router.post("/add-city", (req, res) => {
    res.send("city added!!");
});

router.post("/add-area", (req, res) => {
    res.send("area added!!");
});

router.post("/add-category", (req, res) => {
    var catName = req.body.categoryName;
    var catSubtitle = req.body.subtitle;
    var category = new models.category({ name: catName, image: "image", subtitle: catSubtitle });
    category.save(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("add-categories");
            console.log(result);
        }
    });


});

router.post("/add-sub-category", (req, res) => {
    var mainCategory = req.body.mainCategory;
    var name = req.body.subName;
    var subtitle = req.body.subSubtitle;
    var image = "image";
    var subCategory = models.subCategory({ name: name, subtitle: subtitle, image: image, main_category: mainCategory });
    subCategory.save(function (err, result) {
        if (err) {
            console.log(err);
        }

        else {
            res.redirect("add-sub-categories");
        }
    });
});

router.post("/add-unit", (req, res) => {

    var unitName = req.body.name;
    var unitCode = req.body.code;
    var unit = models.unit({ "unit_id": 1, "name": unitName, "short_code": unitCode });
    unit.save(function (err, result) {
        if (err) {
            console.log(err);
        }

        else {
            res.redirect("units");
        }
    })
});

// Dashboard
router.get("/", function (req, res) {
    res.render("Dashboard/dashboard");
});

// home-slider-images
router.get("/home-slider-images", function (req, res) {
    models.slider.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("app-images/home-slider-images", { data: result });
        }
    })
});

// Email
router.get("/add-product", function (req, res) {
    var units = models.unit.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }

        else {
            res.render("Products/add-product", { data: result });
        }
    })
});

router.get("/product-orders", function (req, res) {
    res.render("Products/product-orders");
});

router.get("/manage-product", function (req, res) {
    res.render("Products/manage-product");
});

// Charts
router.get("/charts-chartist", function (req, res) {
    res.render("Chart/charts-chartist");
});

router.get("/charts-chartjs", function (req, res) {
    res.render("Chart/charts-chartjs");
});

router.get("/charts-flot", function (req, res) {
    res.render("Chart/charts-flot");
});

router.get("/charts-knob", function (req, res) {
    res.render("Chart/charts-knob");
});

router.get("/charts-morris", function (req, res) {
    res.render("Chart/charts-morris");
});

router.get("/charts-sparkline", function (req, res) {
    res.render("Chart/charts-sparkline");
});

// Email-template
router.get("/email-template-Alert", function (req, res) {
    res.render("Email-template/email-template-Alert");
});

router.get("/email-template-basic", function (req, res) {
    res.render("Email-template/email-template-basic");
});

router.get("/email-template-Billing", function (req, res) {
    res.render("Email-template/email-template-Billing");
});

// Forms
router.get("/form-advanced", function (req, res) {
    res.render("Forms/form-advanced");
});

router.get("/form-editors", function (req, res) {
    res.render("Forms/form-editors");
});

router.get("/form-elements", function (req, res) {
    res.render("Forms/form-elements");
});

router.get("/form-mask", function (req, res) {
    res.render("Forms/form-mask");
});

router.get("/form-repeater", function (req, res) {
    res.render("Forms/form-repeater");
});

router.get("/form-uploads", function (req, res) {
    res.render("Forms/form-uploads");
});

router.get("/form-validation", function (req, res) {
    res.render("Forms/form-validation");
});

router.get("/form-wizard", function (req, res) {
    res.render("Forms/form-wizard");
});

router.get("/form-xeditable", function (req, res) {
    res.render("Forms/form-xeditable");
});

// Icons
router.get("/icons-dripicons", function (req, res) {
    res.render("Icons/icons-dripicons");
});
router.get("/icons-fontawesome", function (req, res) {
    res.render("Icons/icons-fontawesome");
});
router.get("/icons-ion", function (req, res) {
    res.render("Icons/icons-ion");
});
router.get("/icons-material", function (req, res) {
    res.render("Icons/icons-material");
});
router.get("/icons-themify", function (req, res) {
    res.render("Icons/icons-themify");
});
router.get("/icons-typicons", function (req, res) {
    res.render("Icons/icons-typicons");
});

// Maps
router.get("/maps-google", function (req, res) {
    res.render("Maps/maps-google");
});
router.get("/maps-vector", function (req, res) {
    res.render("Maps/maps-vector");
});

// Tables
router.get("/tables-basic", function (req, res) {
    res.render("Tables/tables-basic");
});
router.get("/tables-datatable", function (req, res) {
    res.render("Tables/tables-datatable");
});
router.get("/tables-editable", function (req, res) {
    res.render("Tables/tables-editable");
});
router.get("/tables-responsive", function (req, res) {
    res.render("Tables/tables-responsive");
});

// UI
router.get("/ui-alerts", function (req, res) {
    res.render("Ui/ui-alerts");
});
router.get("/ui-buttons", function (req, res) {
    res.render("Ui/ui-buttons");
});
router.get("/ui-cards", function (req, res) {
    res.render("Ui/ui-cards");
});
router.get("/ui-carousel", function (req, res) {
    res.render("Ui/ui-carousel");
});
router.get("/ui-colors", function (req, res) {
    res.render("Ui/ui-colors");
});
router.get("/ui-dropdowns", function (req, res) {
    res.render("Ui/ui-dropdowns");
});
router.get("/ui-general", function (req, res) {
    res.render("Ui/ui-general");
});
router.get("/ui-grid", function (req, res) {
    res.render("Ui/ui-grid");
});
router.get("/ui-images", function (req, res) {
    res.render("Ui/ui-images");
});
router.get("/ui-lightbox", function (req, res) {
    res.render("Ui/ui-lightbox");
});
router.get("/ui-modals", function (req, res) {
    res.render("Ui/ui-modals");
});
router.get("/ui-progressbars", function (req, res) {
    res.render("Ui/ui-progressbars");
});
router.get("/ui-rangeslider", function (req, res) {
    res.render("Ui/ui-rangeslider");
});
router.get("/ui-rating", function (req, res) {
    res.render("Ui/ui-rating");
});
router.get("/ui-session-timeout", function (req, res) {
    res.render("Ui/ui-session-timeout");
});
router.get("/ui-sweet-alert", function (req, res) {
    res.render("Ui/ui-sweet-alert");
});
router.get("/ui-tabs-accordions", function (req, res) {
    res.render("Ui/ui-tabs-accordions");
});
router.get("/ui-typography", function (req, res) {
    res.render("Ui/ui-typography");
});
router.get("/ui-video", function (req, res) {
    res.render("Ui/ui-video");
});

// Layout related pages
router.get("/horizontal", function (req, res) {
    res.render("Dashboard/dashboard-horizontal", { layout: "horizontal-layout" });
});

router.get("/layouts-compact-sidebar", function (req, res) {
    res.render("Dashboard/dashboard-compact", { layout: "compact-layout" });
});

router.get("/layouts-icon-sidebar", function (req, res) {
    res.render("Dashboard/dashboard-icon", { layout: "icon-layout" });
});

router.get("/layouts-boxed", function (req, res) {
    res.render("Dashboard/dashboard-boxed", { layout: "boxed-layout" });
});

// Color Theme vertical
router.get("/vertical-dark", function (req, res) {
    res.render("Dashboard/dashboard", { layout: "vertical-dark-layout" });
});

router.get("/vertical-rtl", function (req, res) {
    res.render("Dashboard/dashboard", { layout: "vertical-rtl-layout" });
});

// Color Theme Horizontal
router.get("/horizontal-dark", function (req, res) {
    res.render("Dashboard/dashboard", { layout: "horizontal-dark-layout" });
});

router.get("/horizontal-rtl", function (req, res) {
    res.render("Dashboard/dashboard", { layout: "horizontal-rtl-layout" });
});

router.get("/horizontal-layouts-boxed", function (req, res) {
    res.render("Dashboard/dashboard", { layout: "horizontal-layouts-boxed" });
});

router.get("/horizontal-layouts-topbar-light", function (req, res) {
    res.render("Dashboard/dashboard", {
        layout: "horizontal-layouts-topbar-light"
    });
});

// Extra Pages
router.get("/pages-timeline", function (req, res) {
    res.render("Authentication/pages-timeline");
});

router.get("/pages-invoice", function (req, res) {
    res.render("Authentication/pages-invoice");
});

router.get("/pages-directory", function (req, res) {
    res.render("Authentication/pages-directory");
});
router.get("/pages-faq", function (req, res) {
    res.render("Authentication/pages-faq");
});
router.get("/pages-gallery", function (req, res) {
    res.render("Authentication/pages-gallery");
});
router.get("/pages-blank", function (req, res) {
    res.render("Authentication/pages-blank");
});
router.get("/pages-pricing", function (req, res) {
    res.render("Authentication/pages-pricing");
});

module.exports = router;

