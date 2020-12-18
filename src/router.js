const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const models = require("./models");
const formidable = require("formidable");
const url = require("url");

//      module imports end here      //

const Constants = require("./config");
const services = require("./services");

//      service file imports end here      //

const UserController = require("./Controllers/Api/UserController");
const AreaController = require("./Controllers/Api/AreaController");
const ProductController = require("./Controllers/Api/ProductController");
const ImagesController = require("./Controllers/Api/ImagesController");
const SettingsController = require("./Controllers/Api/SettingsController");
const OrderController = require("./Controllers/Api/OrderController");

//      controller imports end here      //

//Database connection. Do not modify anything in this URL unless you know what you are doing.
mongoose.connect("mongodb://localhost:27017/" + Constants.DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(console.log("Connected!!"));



router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


router.post("/add-variation", (req, res) => {
    res.render("./views/Forms/form-elements.ejs", {"additionData": variationData});
});

/*

    Route handling below. Do not modify anything in the path. These are the API
    endpoints as well as admin panel endpoints. Changing anything can result in
    misbehaving or crashing of the application.


*/


// Admin panel routes


router.post("/add-product", (req, res) => {
    console.log(req);
    models.category.findOne({name: req.body.category}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            models.subCategory.findOne({name: req.body.subcategory}, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    var product = models.product({
                        name: req.body.productname,
                        slug: req.body.productname,
                        category_id: result.id,
                        sub_category_id: result2.id,
                        indicator: 1,
                        image: req.body.image,
                        other_images: "",
                        description: req.body.description,
                        status: req.body.availability == "Available" ? 1 : 0,
                        date_added: Date.now(),
                    });

                    product.save((err3, result3) => {
                        if (err3) {
                            console.log(err3);
                        } else {
                            models.unit.findOne({short_code: req.body.measurmentunit}, (err4, result4) => {
                                if (err4) {
                                    console.log(err4);
                                } else {
                                    models.unit.findOne({short_code: req.body.stockunit}, (err5, result5) => {
                                        if (err5) {
                                            console.log(err5);
                                        } else {
                                            var variant = models.productVariant({
                                                product_id: result3.id,
                                                type: req.body.type,
                                                measurement: req.body.measurment,
                                                measurement_unit_id: result4.id,
                                                measurement_unit_name: result4.name,
                                                price: req.body.price,
                                                discounted_price: req.body.discountprice,
                                                serve_for: 2,
                                                stock: req.body.stock,
                                                stock_unit_id: result5.id,
                                                stock_unit_name: result5.name,
                                            });

                                            console.log(req.body.measurment);

                                            variant.save((err6, result6) => {
                                                if (err) {
                                                    console.log(err6);
                                                } else {
                                                    res.redirect("/add-product");
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post("/upload-slider-image", (req, res) => {
    var type = req.body.type;
    var imagePath;
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on("fileBegin", (name, file) => {
        file.path = __dirname + "/public/images/uploads/" + file.name;
        imagePath = "/public/images/uploads/" + file.name;
    });
    form.on("file", (name, file) => {
        console.log("Uploaded" + imagePath);
        var sliderImage = models.slider({
            type: type,
            type_id: "type_id",
            image: imagePath,
            date_added: Date.now(),
        });

        sliderImage.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("home-slider-images");
            }
        });
    });
});

router.post("/upload-offer-image", (req, res) => {
    var imagePath;
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on("fileBegin", (name, file) => {
        file.path = __dirname + "/public/images/uploads" + file.name;
        imagePath = "/public/images/uploads/" + file.name;
    });
    form.on("file", (name, file) => {
        console.log("uploaded" + imagePath);
        var offerImage = models.offer({
            image: imagePath,
            date_added: Date.now()
        });
        offerImage.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("new-offer-images");
            }
        });
    })
});

router.get("/delete-offer-image", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.offer.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("new-offer-images");
        }

    });
})

router.get("/promo-codes", (req, res) => {
    models.promoCode.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("promo-codes", {data: result});
        }
    })
});

router.get("/featured-section", (req, res) => {
    models.section.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("featured-section", {data: result});
        }
    })
});

router.get("/customers", (req, res) => {
    models.user.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("customers/customers", {data: result});
        }
    });
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
    models.user.findOne({name: customerName}).select("balance -_id").exec((err, result) => {
        if (err) {
            console.log(err);
        } else {
            oldAmount = result.balance;
            console.log(oldAmount);
            if (txnType == "credit") {
                newAmount = (oldAmount - 0) + (amount - 0); //subtraction is done because js don't support addition
                models.user.updateOne({name: customerName}, {$set: {balance: newAmount}}, (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(doc);
                    }
                });
            } else if (txnType == "debit") {
                newAmount = oldAmount - amount;
                models.user.updateOne({name: customerName}, {$set: {balance: newAmount}}, (err, docu) => {
                    if (err) {
                        console.log(err);
                    } else {
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
            } else {
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
    models.promoCode.find({}).sort({_id: -1}).limit(1).exec((err, result) => {
        if (err) {
            console.log(err);
        } else {
            promoCodeID = result.code_id + 1;
        }
    });

    if (repeat == "Allowed") {
        repeat_code = 1;
    } else if (repeat == "Not Allowed") {
        repeat_code = 0;
    }

    if (status == "Active") {
        status_code = 1;
    } else if (status == "Deactive") {
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
        } else {
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
        } else {
            res.redirect("featured-section");
        }
    });
});

router.get("/new-offer-images", (req, res) => {
    models.offer.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("app-images/new-offer-images", {data: result});
        }
    });
});

router.get("/payment-requests", (req, res) => {
    res.render("payment-requests");
});

router.get("/return-requests", (req, res) => {
    res.render("return-requests");
});

router.post("/add-delivery-boy", (req, res) => {
    var deliveryBoyName = req.body.name;
    var mobileNumber = req.body.mobile;
    var pass = req.body.password;
    var confirmPass = req.body.confirmpassword;
    var address = req.body.address;
    var bonus = req.body.bonus;
    if (pass != confirmPass) {
        res.send("passwords dont match!!");
    } else {

        var deliveryBoy = models.deliveryBoy({
            name: deliveryBoyName,
            mobile: mobileNumber,
            password: pass,
            address: address,
            bonus: bonus,
            balance: 0,
            status: 1,
            date_created: Date.now(),
            fcm_id: "FCM",
        });

        deliveryBoy.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("manage-delivery-boys");
            }
        });
    }
});

router.get("/manage-delivery-boys", (req, res) => {
    models.deliveryBoy.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("delivery-boys/manage-delivery-boys", {data: result});
        }
    });
});

router.get("/delete-delivery-boy", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.deliveryBoy.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("manage-delivery-boys");
        }

    });
});

router.get("/fund-transfers", (req, res) => {
    res.render("delivery-boys/fund-transfer");
});

router.get("/send-notification", (req, res) => {
    res.render("send-notification");
});

router.post("/send-message", (req, res) => {
    let notificationTitle = req.body.title;
    let notificationMessage = req.body.message;
    models.user.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            for (let i = 0; i < result.length; i++) {
                services.SendNotification(result[i].fcm_id, notificationTitle, notificationMessage);
                if (i == result.length - 1) {
                    res.redirect("/send-notification");
                }
            }
        }
    });
});

router.get("/transaction", (req, res) => {
    models.transaction.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("transaction", {data: result});
        }
    });
});

router.get("/wallet-transactions", (req, res) => {
    models.walletTransaction.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("wallet-transactions", {data: result});
        }
    });
});

router.get("/store-settings", (req, res) => {
    models.setting.findOne({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.render("settings", {data: result});
        }
    });
});

router.get("/payment-methods", (req, res) => {
    models.paymentSettings.findOne((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("system/payment-methods", {data: result});
            console.log(result);
        }
    });
});

router.get("/time-slots", (req, res) => {
    models.timeSlot.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("system/time-slots", {data: result});
        }
    });
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
    models.city.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("locations/cities", {data: result});
            console.log(result);
        }
    });
});

router.get("/areas", (req, res) => {
    models.area.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("locations/areas", {data: result});
            console.log(result);
        }
    });
});

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

router.post("/update-settings", (req, res) => {
    console.log(req.body)
    let appName = req.body.appname;
    let supportNumber = req.body.supportnumber;
    let supportEmail = req.body.supportemail;
    let currentversion = req.body.currentversion;
    let minversion = req.body.minversion;
    let versionStatusCheck = req.body.versionsystemstatus == "Enable" ? 1 : 0;
    let currency = req.body.currencycode;
    let gst = req.body.gst;
    let cgst = req.body.cgst;
    let sgst = req.body.sgst;
    let igst = req.body.igst;
    let deliverychargeamt = req.body.devliverychargeamt;
    let minfreedelivery = req.body.minfreedelivery;
    let timezone = req.body.timezone;
    let referEarnEnable = req.body.referandearnsystem == "Enable" ? 1 : 0;
    let minreferamt = req.body.minreferamt;
    let referbonus = req.body.referbonus;
    let refermethod = req.body.refermethod;
    let maxreferamt = req.body.maxreferamt;
    let minwithdrawamt = req.body.minwithdrawamt;
    let maxreturndays = req.body.maxdaysreturn;
    let deliveryboybonus = req.body.deliveryboybonus;
    let fromemail = req.body.fromemail;
    let replyemail = req.body.replyemail;
    let setting = {
        app_name: appName,
        support_number: supportNumber,
        support_email: supportEmail,
        current_version: currentversion,
        min_version: minversion,
        version_status_check: versionStatusCheck,
        currency: currency,
        gst: gst,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        delivery_charge: deliverychargeamt,
        min_free_delivery_amount: minfreedelivery,
        system_time_zone: timezone,
        refer_and_earn_enable: referEarnEnable,
        min_refer_and_earn_amount: minreferamt,
        refer_and_earn_bonus: referbonus,
        refer_and_earn_method: refermethod,
        max_refer_and_earn_amount: maxreferamt,
        min_withdraw_amount: minwithdrawamt,
        max_days_to_return_item: maxreturndays,
        delivery_boy_bonus: deliveryboybonus,
        from_email: fromemail,
        reply_to_email: replyemail
    }

    models.setting.findOne({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            models.setting.findByIdAndUpdate(result.id, setting, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    console.log(result2);
                    res.redirect("/store-settings");
                }
            });
        }
    });
});

router.post("/update-payment-methods", (req, res) => {
    console.log(req.body);
    let paypal_method = req.body.paypal == "Enable" ? 1 : 0;
    let paypalmode = req.body.paypalmode;
    let paypalid = req.body.paypalid;
    let payu_method = req.body.payu == "Enable" ? 1 : 0;
    let payumoneymode = req.body.payumoneymode;
    let payumerchentkey = req.body.payumerchentkey;
    let payumerchentid = req.body.payumerchentid;
    let payusalt = req.body.payusalt;
    let razormode = req.body.razor == "Enable" ? 1 : 0;
    let razorpaykeyid = req.body.razorpaykeyid;
    let razorpaysecretkey = req.body.razorsecretkey;
    let setting = {
        paypal_payment_method: paypal_method,
        paypal_mode: paypalmode,
        paypal_buisness_email: paypalid,
        payumoney_payment_method: payu_method,
        payumoney_mode: payumoneymode,
        payumoney_merchant_key: payumerchentkey,
        payumoney_merchant_id: payumerchentid,
        payumoney_salt: payusalt,
        razorpay_payment_method: razormode,
        razorpay_key: razorpaykeyid,
        razorpay_secret_key: razorpaysecretkey,
    }


    console.log(setting);

    models.paymentSettings.findOne({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            models.paymentSettings.findByIdAndUpdate(result.id, setting, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    res.redirect("/payment-methods");
                }
            });
        }
    });
});

router.post("/add-time-slots", (req, res) => {
    var title = req.body.title;
    var fromTime = req.body.from;
    var toTime = req.body.to;
    var lastOrderTime = req.body.lastordertime;
    var status = req.body.status == "Active" ? 1 : 0;
    var timeSlot = models.timeSlot({
        title: title,
        from_time: fromTime,
        to_time: toTime,
        last_order_time: lastOrderTime,
        status: status
    });

    timeSlot.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/time-slots");
        }
    });
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
    var cityName = req.body.cityname;
    var city = new models.city({name: cityName});
    city.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/cities");
        }
    });
});

router.post("/add-area", (req, res) => {
    var areaname = req.body.areaname;
    var cityName = req.body.city;
    var area = new models.area({name: areaname, city_name: cityName});
    area.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/areas");
        }
    });
});

router.post("/add-category", (req, res) => {
    var catName = req.body.categoryName;
    var catImage = req.body.image;
    var catSubtitle = req.body.subtitle;
    var category = new models.category({name: catName, image: catImage, subtitle: catSubtitle});
    category.save(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("add-categories");
            console.log(result);
        }
    });


});

router.post("/add-sub-category", (req, res) => {
    var mainCategory = req.body.mainCategory;
    var name = req.body.subName;
    var subtitle = req.body.subSubtitle;
    var image = req.body.image;

    models.category.find({name: mainCategory}, (err, result) => {
        var subCategory = models.subCategory({
            category_id: result[0].id,
            name: name,
            subtitle: subtitle,
            image: image,
            main_category: mainCategory,
            slug: name
        });
        subCategory.save(function (err2, result2) {
            if (err) {
                console.log(err2);
            } else {
                res.redirect("add-sub-categories");
            }
        });
    });

});

router.post("/add-unit", (req, res) => {

    var unitName = req.body.name;
    var unitCode = req.body.code;
    var unit = models.unit({"unit_id": 1, "name": unitName, "short_code": unitCode});
    unit.save(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("noerror");
            //     }

            //     else {
            //         // res.redirect("/promo-codes");
            //         console.log(result);
            //     }
        }
    });

});

router.get("/home", (req, res) => {
    res.render("Dashboard/dashboard");
});

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

router.get("/delete-slider-image", (req, res, next) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.slider.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("home-slider-images");
        }

    });
});

router.get("/delete-category", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.category.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("categories");
        }

    });
});

router.get("/delete-sub-category", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.subCategory.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("sub-categories");
        }

    });
});

router.get("/delete-promo-code", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.promoCode.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("promo-codes");
        }

    });
});

router.get("/delete-featured-section", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.section.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("featured-section");
        }

    });
})

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

router.post("/update-promo-code", (req, res) => { //some work pending in this part
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    var promoCode = req.body.promocode;
    var message = req.body.message;
    var startDate = req.body.startdate;
    var endDate = req.body.enddate;
    var noOfUsers = req.body.noofusers;
    var minOrderAmt = req.body.minorderamt;
    var discount = req.body.discount;
    var discountType = req.body.discounttype;
    var maxDiscount = req.body.maxdiscount;
    var repeatUsage = req.body.repeat;
    var repeatUsageCode;
    var status = req.body.status;
    var statusCode;
    if (repeatUsage == "Allowed") {
        repeatUsageCode = 1;
    } else {
        repeatUsageCode = 0;
    }

    if (status == "Active") {
        statusCode = 1;
    } else {
        statusCode = 0;
    }

    var update = {
        promo_code: promoCode,
        message: message,
        start_date: startDate,
        end_date: endDate,
        no_of_users: noOfUsers,
        minimum_order_amount: minOrderAmt,
        discount: discount,
        discount_type: discountType,
        max_discount_amount: maxDiscount,
        repeat_usage: repeatUsageCode,
        status: statusCode
    };

    // models.promoCode.updateOne({ "_id": id }, { $set: update }, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     }

    //     else {
    //         // res.redirect("/promo-codes");
    //         console.log(result);
    //     }
    // })

    models.promoCode.findByIdAndUpdate(id, update, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/promo-codes");
        }
        s
    });
});

router.get("/orders", (req, res) => {
    models.order.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("orders", {data: result});
        }
    });
});

router.get("/testorder", (req, res) => {
    var order = models.order({
        user_id: "U_007",
        delivery_boy_id: "D_007",
        mobile: "6375528478",
        total: 200,
        delivery_charge: 0,
        tax_amount: 40,
        tax_percentage: 20,
        wallet_balance: 500,
        discount: 0,
        promo_code: "",
        promo_discount: 0,
        final_total: 240,
        payment_method: "COD",
        address: "Address",
        latitude: "Latitude",
        longitude: "Longitude",
        delivery_time: "Time",
        status: "0",
        active_status: "Recived",
        date_added: Date.now()
    });

    order.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});

router.get("/testorderitem", (req, res) => {
    var item = models.orderItem({
        user_id: "Chirag Jangid",
        order_id: "5f56102a7d01fe1f51f5d990",
        item_name: "Item 3",
        product_variant_id: 32,
        quantity: 50,
        price: 10,
        discounted_price: 10,
        discount: 0,
        sub_total: 500,
        deliver_by: "Delivery Boy",
        status: "Recived",
        active_status: "Recived",
        date_added: Date.now()
    });

    item.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
            console.log(result);
        }
    });
});

router.get("/view-order", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.order.findById(id).lean().exec((err, result) => {
        if (err) {
            console.log(err);
        } else {
            models.deliveryBoy.find({}, (err2, result2) => {
                if (err) {
                    console.log(err);
                } else {
                    models.user.findById(result.user_id, (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                        } else {

                            models.orderItem.find({order_id: id}, (err4, result4) => {
                                if (err4) {
                                    console.log(err4);
                                } else {
                                    let information = {
                                        order: result,
                                        deliveryBoys: result2,
                                        user: result3,
                                        items: result4
                                    };
                                    res.render("order-details", {data: information});
                                }
                            });

                        }
                    });
                }
            });
        }
    });
});

router.post("/update-order", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    var discount = req.body.discount;
    var deliverBy = req.body.deliver_by;
    var status = req.body.status;
    var totalPayable;
    var final_total;
    let update = {};
    let canUpdateOrderStatus;
    models.order.findById(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (discount != result.discount) {
                totalPayable = result.total + result.tax_amount;
                final_total = (totalPayable - 0) - (totalPayable * (discount / 100));
            } else {
                final_total = result.final_total;
            }

            let statusArray = [];

            let updateStatus = true;

            statusArray = result.status.split(",");

            for (let i = 0; i <= statusArray.length; i++) {
                if (i % 2 == 0) {
                    if (statusArray[i] == status.toLowerCase()) {
                        updateStatus = false;
                        break;
                    }
                }
            }

            statusArray.push(status.toLowerCase());
            statusArray.push(Date.now());

            if (updateStatus) {
                canUpdateOrderStatus = true;
                update = {
                    delivery_boy_id: deliverBy,
                    discount: discount,
                    final_total: final_total,
                    status: statusArray.toString(),
                    active_status: status
                };
            } else {
                canUpdateOrderStatus = false;
                update = {
                    delivery_boy_id: deliverBy,
                    discount: discount,
                    final_total: final_total,
                };
            }

            let orderItemStatusArray = [];

            models.orderItem.find({order_id: result.id}, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                } else {

                    let orderItemUpdate = {
                        discount: discount,
                        deliver_by: deliverBy,
                        status: null,
                        active_status: status,
                    };

                    if (updateStatus) {
                        for (let i = 0; i < result2.length; i++) {
                            orderItemStatusArray = [];
                            orderItemStatusArray = result2[i].status.split(",");
                            orderItemStatusArray.push(status.toLowerCase());
                            orderItemStatusArray.push(Date.now());
                            orderItemUpdate.status = orderItemStatusArray.toString();

                            console.log(orderItemUpdate);

                            models.orderItem.findByIdAndUpdate(result2[i].id, orderItemUpdate, (err3, result3) => {
                                if (err3) {
                                    console.log(err3);
                                }
                            });
                        }
                    }


                    console.log(update);

                    models.user.findById(result.user_id, (err, user) => {
                        if (err) {
                            console.log(err);
                        } else {
                            models.order.findByIdAndUpdate(id, update, (err, ordrRslt) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (canUpdateOrderStatus) {
                                        services.OrderStatusUpdateEmail(user.email, user.name, ordrRslt.id, update.active_status);
                                        services.SendOrderStatusUpdateNotification(user.fcm_id, result.id, update.active_status);
                                    }
                                    res.redirect("/orders");
                                }
                            });
                        }
                    });


                }
            });


        }
    });
});

router.get("/delete-order", (req, res) => {

    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;

    models.orderItem.find({order_id: id}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            for (let i = 0; i < result.length; i++) {
                models.orderItem.findByIdAndRemove(result[i].id, (err2, result2) => {
                    if (err2) {
                        console.log(err2);
                    }
                });
            }
        }
    });

    models.order.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("orders");
        }
    });
});

router.get("/generate-invoice", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.order.findById(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            models.orderItem.find({order_id: id, active_status: {"$ne": "cancelled"}}, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    models.user.findById(result.user_id, (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                        } else {
                            var info = {
                                order: result,
                                items: result2,
                                user: result3,
                            };

                            res.render("invoice", {data: info});
                        }
                    });
                }
            });
        }
    });
});

router.get("/delete-city", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.city.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/cities");
        }
    });
});

router.get("/delete-area", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.area.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/areas");
        }
    });
});



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

router.post("/add-tax", (req, res) => {
    var name = req.body.taxname;
    console.log(name);
    var percentage = req.body.percentage;
    var tax = models.taxes({
        title: name,
        percentage: percentage,
        status: 1
    });
    tax.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/taxes");
        }
    });
});

router.get("/delete-tax", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.taxes.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/taxes");
        }
    });
});

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

router.post("/update-tax", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    var name = req.body.taxname;
    var percentage = req.body.percentage;
    var statusString = req.body.status;
    var status = statusString == "Active" ? 1 : 0;
    var document = {
        title: name,
        percentage: percentage,
        status: status
    };

    console.log(id);

    models.taxes.findByIdAndUpdate(id, document, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(document);
            console.log(result);
            res.redirect("/taxes");
        }
    });
});


router.get("/delete-time-slot", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.timeSlot.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/time-slots");
        }
    });
});



router.get("/manage-product", (req, res) => {
    res.render("Products/manage-product.ejs");
});

router.post("/fetching", (req, res) => {
    let name = req.body.name;
    let response = {
        error: false,
        message: "You sent " + name,
    };
    res.send(response);
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
