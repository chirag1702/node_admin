const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const models = require("./models");
const formidable = require("formidable");
const url = require("url");
// const {response} = require("express");
const services = require("./services");

mongoose.connect("mongodb://localhost:27017/ekart_DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(console.log("Connected!!"));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


router.post("/add-variation", (req, res) => {
    res.render("./views/Forms/form-elements.ejs", {"additionData": variationData});
});

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
                                                measurement: req.body.measurement,
                                                measurement_unit_id: result4.id,
                                                measurement_unit_name: result4.name,
                                                price: req.body.price,
                                                discounted_price: req.body.discountprice,
                                                serve_for: 2,
                                                stock: req.body.stock,
                                                stock_unit_id: result5.id,
                                                stock_unit_name: result5.name,
                                            });

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
    var notificationType = req.body.type;
    var notificationTitle = req.body.title;
    var notificationMessage = req.body.message;
    var notification = models.notification({
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
        type_id: "type ID",
        image: "image",
        date_sent: Date.now()
    });
    notification.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/send-notification");
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
        }s
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
                update = {
                    delivery_boy_id: deliverBy,
                    discount: discount,
                    final_total: final_total,
                    status: statusArray.toString(),
                    active_status: status
                };
            } else {
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

                    models.order.findByIdAndUpdate(id, update, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect("/orders");
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

router.post("/api-firebase/get-categories", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var access_key = urlQuery.accesskey;
    console.log("api accessed");
    var response = {
        "error": true,
        "data": null,
        "message": null
    };
    models.category.find().lean().exec((err, result) => {
        if (err) {
            console.log(err)
        } else {

            response.error = false;
            response.data = result;

            // console.log(response);

        }

        res.send(response);
    });
});

router.post("/api-firebase/offer-images", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var response = {
        "error": true,
        "data": null
    };

    models.offer.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.error = false;
            response.data = result;
            // console.log(response);
        }

        res.send(response);
    })
});

router.post("/api-firebase/sections", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var getVal = urlQuery.getallsections;
    var productArray = [];
    var productObject;
    var variantsArray = [];
    var variantsObject;
    var sectionArray = [];
    var sectionObject;
    models.product.find({}, (err, productResult) => {
        if (err) {
            console.log(err);
        } else {

            for (let index = 0; index < productResult.length; index++) {
                models.productVariant.findOne({}, (err2, variantsResult) => {
                    if (err2) {
                        console.log(err2);
                    } else {
                        if (variantsResult != null) {
                            for (let i = 0; i < variantsResult.length; i++) {
                                variantsObject = {
                                    "id": variantsResult[i].id,
                                    "product_id": variantsResult[i].product_id,
                                    "type": variantsResult[i].type,
                                    "measurment": variantsArray[i].measurment,
                                    "measurment_unit_id": variantsArray[i].measurment_unit_id,
                                    "price": variantsArray[i].price,
                                    "discounted_price": variantsArray[i].discounted_price,
                                    "serve_for": variantsArray[i].serve_for,
                                    "stock": variantsArray[i].stock,
                                    "stock_unit_id": variantsArray[i].stock_unit_id,
                                    "measurment_unit_name": variantsArray[i].measurment_unit_name,
                                    "stock_unit_name": variantsArray[i].stock_unit_name
                                };
                                variantsArray.push(variantsObject);
                            }
                        }
                    }
                });
                productObject = {
                    "id": productResult[index].id,
                    "name": productResult[index].name,
                    "slug": productResult[index].slug,
                    "category_id": productResult[index].category_id,
                    "sub_category_id": productResult[index].sub_category_id,
                    "indicator": productResult[index].indicator,
                    "image": productResult[index].image,
                    "other_images": productResult[index].other_images,
                    "description": productResult[index].description,
                    "status": productResult[index].status,
                    "date_added": productResult[index].date_added,
                    "variants": variantsArray
                };
                productArray.push(productObject);
            }

            models.section.find({}, (err3, sectionsResult) => {
                if (err3) {
                    console.log(err3);
                } else {
                    for (let j = 0; j < sectionsResult.length; j++) {
                        sectionObject = {
                            "id": sectionsResult[j].id,
                            "title": sectionsResult[j].title,
                            "short_desc": sectionsResult[j].short_description,
                            "product_ids": sectionsResult[j].product_ids,
                            "products": productArray
                        };
                        sectionArray.push(sectionObject);
                    }
                    res.send(sectionArray);
                }
            });

        }
    });
});

router.post("/api-firebase/slider-images", (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var getVal = urlQuery.getsliderimages;
    var response = {
        "error": true,
        "data": null
    };

    models.slider.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.error = false;
            response.data = result;
            // console.log(response);
        }

        res.send(response);
    })
});

//World's most annoying code below: (from line 1324 to 1687)
router.post("/api-firebase/user-registration", (req, res) => {

    console.log("api accessed!!");

    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var requestType = req.body.type;
    var mobileNumber = req.body.mobile;

    console.log(requestType);
    console.log(mobileNumber);

    var response = {
        "error": true,
        "_id": null,
        "message": null,
    };

    if (requestType == "verify-user") {
        models.user.find({mobile: mobileNumber}, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
            } else {

                console.log(result);

                if (result.length == 0) {
                    response.error = false;
                    response.message = "Ready to sent firebase OTP request!";
                    res.send(response);
                } else {

                    response.error = true;
                    response._id = result[0].id;
                    response.message = "This mobile is already registered. Please login!";
                    res.send(response);
                    console.log(response);
                }
            }
        });
    } else if (requestType == "register") {

        console.log("registration in process!!");

        var name = req.body.name;
        var email = req.body.email;
        var mno = req.body.mobile;
        var password = req.body.password;
        var pincode = req.body.pincode;
        var cityID = req.body.city_id;
        var areaID = req.body.area_id;
        var street = req.body.street;
        var longitude = req.body.longitude;
        var latitude = req.body.latitude;
        var country_code = req.body.country_code;
        var refferal_code = req.body.referral_code;
        var friends_code = req.body.friends_code;
        var fcm_id = req.body.fcm_id;

        var response = {
            "error": true,
            "message": null,
            "user_id": null,
            "name": null,
            "email": null,
            "mobile": null,
            "country_code": null,
            "fcm_id": null,
            "dob": null,
            "city_id": null,
            "city_name": null,
            "area_id": null,
            "area_name": null,
            "street": null,
            "pincode": null,
            "referral_code": null,
            "friends_code": null,
            "latitude": null,
            "longitude": null,
            "apikey": null,
            "status": null,
            "created_at": null
        };

        models.city.findById(cityID, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                models.area.findById(areaID, (err2, result2) => {
                    if (err2) {
                        console.log(err);
                    } else {
                        var user = models.user({
                            name: name,
                            email: email,
                            country_code: country_code,
                            mobile: mno,
                            dob: "",
                            city: result.name,
                            area: result2.name,
                            street: street,
                            pincode: pincode,
                            apikey: "",
                            balance: 0,
                            refferal_code: refferal_code,
                            friends_code: friends_code,
                            fcm_id: fcm_id,
                            latitude: latitude,
                            longitude: longitude,
                            password: password,
                            status: 1,
                            created_at: Date.now(),
                        });

                        user.save((err3, result3) => {
                            if (err3) {
                                console.log(err);
                                response.error = true;
                                response.message = "some error occoured!!";
                                res.send(response);
                            } else {
                                console.log("saved!!");
                                response.error = false;
                                response.message = "User registered successfully";
                                response.user_id = result3.id;
                                response.name = name;
                                response.email = email;
                                response.mobile = mno;
                                response.country_code = country_code;
                                response.fcm_id = fcm_id;
                                response.dob = "";
                                response.city_id = cityID;
                                response.city_name = result.name;
                                response.area_id = areaID;
                                response.area_name = result2.name;
                                response.street = street;
                                response.pincode = pincode;
                                response.referral_code = refferal_code;
                                response.friends_code = friends_code;
                                response.latitude = latitude;
                                response.longitude = longitude;
                                response.apikey = "";
                                response.status = 1;
                                response.created_at = Date.now();
                                console.log(response);
                                res.send(response);
                            }
                        });
                    }
                })
            }
        });


    } else if (requestType == "change-password") {

        var newPassword = req.body.password;
        var userID = req.body._id;

        var update = {
            password: newPassword,
        };

        var response = {
            "error": true,
            "message": null,
        };

        models.user.findByIdAndUpdate(userID, update, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!"
                res.send(response);
                console.log(response);
            } else {
                response.error = false;
                response.message = "profile updated successfully!!";
                res.send(response);
                console.log(response);
            }
        });

    } else if (requestType == "edit-profile") {

        var body = req.body;

        var userID = req.body._id;

        delete body['type'];
        delete body['_id'];

        var update = body;

        var response = {
            "error": true,
            "message": null,
        };

        models.user.findByIdAndUpdate(userID, update, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
                res.send(response);
                console.log(response);
            } else {
                response.error = false;
                response.message = "profile updated successfully!!";
                res.send(response);
                console.log(response);
            }
        });

    } else {
        console.log("none");

        var response = {
            "error": true,
            "message": null
        };

        res.send(response);

        console.log(response);
    }

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

router.post("/api-firebase/get-cities", (req, res) => {
    var response = {
        "error": true,
        "data": null,
        "message": null
    };

    models.city.find({}, (err, result) => {
        if (err) {
            console.log(err);
            response.error = true;
            response.message = "some error occoured!!"
            res.send(response);
        } else {
            if (result != null) {
                response.error = false;
                response.data = result;
                res.send(response);
            } else {
                response.error = true;
                response.message = "no data found!!";
                res.send(response);
            }
        }
    });

});

router.post("/api-firebase/get-areas-by-city-id", (req, res) => {
    var cityID = req.body.city_id

    var response = {
        "error": false,
        "data": null,
        "message": null
    };


    if (cityID == "0") {

        response.message = "no data found!!";
        res.send(response);
    } else {

        models.city.findById(cityID, (err, result) => {
            if (err) {
                console.log(err);
            } else {

                console.log(result);

                models.area.find({city_name: result.name}, (err2, result2) => {
                    if (err2) {
                        console.log(err2);
                        response.error = true;
                        response.message = "some error occoured!!";
                        res.send(response);
                    } else {

                        // console.log(result2);

                        if (result2 != null) {
                            response.error = false;
                            response.data = result2;
                            res.send(response);
                        } else {
                            response.error = true;
                            response.message = "no data found!!";
                            res.send(response);
                        }
                    }
                });
            }
        });
    }


});

router.post("/api-firebase/login", (req, res) => {
    var mobileNumber = req.body.mobile;
    var password = req.body.password;
    var fcm_id = req.body.fcm_id;
    console.log(fcm_id);
    var query = {
        "mobile": mobileNumber,
        "password": password,
    };
    var response = {
        "error": true,
        "message": null,
        "user_id": null,
        "name": null,
        "email": null,
        "mobile": null,
        "country_code": null,
        "fcm_id": null,
        "dob": null,
        "city_id": null,
        "city_name": null,
        "area_id": null,
        "area_name": null,
        "street": null,
        "pincode": null,
        "referral_code": null,
        "friends_code": null,
        "latitude": null,
        "longitude": null,
        "apikey": null,
        "status": null,
        "created_at": null
    };
    models.user.find(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {

            console.log("response" + result.length);

            if (Array.isArray(result) && result.length == 1) {

                console.log(result);

                response.error = false;
                response.message = "User logged in successfully";
                response.user_id = result[0].id;
                response.name = result[0].name;
                response.email = result[0].email;
                response.mobile = result[0].mobile;
                response.country_code = result[0].country_code;
                response.fcm_id = result[0].fcm_id;
                response.dob = result[0].dob;
                // response.city = result3.id;
                response.city_name = result[0].city;
                // response.area_id = result2.id;
                response.area_name = result[0].area;
                response.street = result[0].street;
                response.pincode = result[0].pincode;
                response.referral_code = result[0].refferal_code;
                response.friends_code = result[0].friends_code;
                response.latitude = result[0].latitude;
                response.longitude = result[0].longitude;
                response.apikey = result[0].apikey;
                response.status = result[0].status;
                response.created_at = result[0].created_at;
                console.log(response);
                res.send(response);

                // models.area.findOne({ name: result.area }, (err2, result2) => {
                //     if (err2) {
                //         console.log(err);
                //     } else {
                //         models.city.findOne({ name: result.city }, (err3, result3) => {
                //             if (err3) {
                //                 console.log(err3);
                //             } else {

                //             }
                //         });
                //     }
                // });

            } else {
                console.log(result);
                response.error = true;
                response.message = "incorrect credentials";
                res.send(response);
            }


        }
    });
});

router.post("/api-firebase/get-user-data", (req, res) => {


    console.log(req.body);

    var userID = req.body.user_id;
    var response = {
        "error": true,
        "name": null,
        "email": null,
        "country_code": null,
        "mobile": null,
        "dob": null,
        "city": null,
        "area": null,
        "street": null,
        "pincode": null,
        "apikey": null,
        "balance": null,
        "refferal_code": null,
        "friends_code": null,
        "fcm_id": null,
        "latitude": null,
        "longitude": null,
        "password": null,
        "status": null,
        "created_at": null,
    };

    models.user.findById(userID, (err, result) => {
        if (err) {
            console.log(err);
            response.error = true;
            res.send(response);
            console.log(response);
        } else {

            console.log(result);

            if (result == null) {
                response.error = true;
                response.message = "no user found!!";
            } else {
                console.log("done!!");
                response.error = false;
                response.name = result.name;
                response.email = result.email;
                response.country_code = result.country_code;
                response.mobile = result.mobile;
                response.dob = result.dob;
                response.city = result.city;
                response.area = result.area;
                response.street = result.street;
                response.pincode = result.pincode;
                response.apikey = result.apikey;
                response.balance = result.balance;
                response.refferal_code = result.refferal_code;
                response.friends_code = result.friends_code;
                response.latitude = result.latitude;
                response.longitude = result.longitude;
                response.password = result.password;
                response.status = result.status;
                response.created_at = result.created_at;
                res.send(response);
                console.log(response);
            }
        }
    });

});

router.post("/api-firebase/get-subcategories-by-category-id", (req, res) => {
    var category_id = req.body.category_id;

    var response = {
        "error": true,
        "message": null,
        "data": null,
    };

    models.subCategory.find({category_id: category_id}, (err, result) => {
        if (err) {
            console.log(err);
            response.error = true;
            response.message = "some error occoured!!";
            res.send(response);
        } else {
            response.error = false;
            response.data = result;
            res.send(response);
        }
    });
});

router.post("/api-firebase/get-products-by-subcategory-id", (req, res) => {
    var subcategoryid = req.body.subcategory_id;
    console.log(subcategoryid);
    var response = {
        "error": true,
        "total": null,
        "data": null,
    };

    var otherimages = [];

    models.product.find({sub_category_id: subcategoryid}).lean().exec((err, products) => {
        if (err) {
            console.log(err);
        } else {
            for (let index = 0; index < products.length; index++) {
                models.productVariant.find({product_id: products[index]._id}, (err2, result) => {
                    if (err2) {
                        console.log(err2);
                    } else {
                        response.error = false;
                        response.total = products.length;
                        products[index].variants = JSON.parse(JSON.stringify(result));
                        products[index].other_images = otherimages;
                        response.data = products;
                        if (index == products.length - 1) {
                            console.log("if executed")
                            console.log(response);
                            res.send(response);
                        }
                    }
                });
            }
        }
    });
});

router.post("/api-firebase/settings", (req, res) => {
    console.log("settings api");
    var paymentURL = req.body.get_payment_methods;
    var timeSlotURL = req.body.get_time_slots;

    var response = {
        "error": true,
        // "payment_methods": null,
        "message": null,
    };


    if (paymentURL == 1) {
        models.paymentSettings.findOne({}, (err, result) => {
            if (err) {
                response.error = false;
                response.message = "some error occoured!!";
                console.log(err);
                res.send(response);
            } else {
                response.error = false;
                response.payment_methods = result;
                response.message = "data found successfully!!";
                res.send(response);
            }
        });
    } else if (timeSlotURL == 1) {
        models.timeSlot.find({}, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!"
                res.send(response);
            } else {
                response.error = false;
                response.message = "data found!!";
                response.time_slots = result;
                res.send(response);
            }
        });
    }
});

router.post("/api-firebase/get-product-by-id", (req, res) => {
    console.log("get product by id!!");
    var productID = req.body.product_id;
    console.log(productID);

    var response = {
        "error": true,
        "data": null,
    };

    var images = [];

    var data = [];

    models.product.findById(productID).lean().exec((err, result) => {
        if (err) {
            response.error = true;
            res.send(response);
            console.log(err);
        } else {
            models.productVariant.find({product_id: productID}).lean().exec((err2, result2) => {
                if (err2) {
                    response.error = true;
                    res.send(response);
                    console.log(err2);
                } else {
                    result.variants = JSON.parse(JSON.stringify(result2));
                    result.other_images = images;
                    result2[0].serve_for = "Available";
                    response.error = false;
                    data.push(result);
                    response.data = data;
                    res.send(response);
                    console.log(response);
                    console.log(result2);
                }
            });
        }
    });
});

router.post("/api-firebase/order-process", (req, res) => {
    console.log(req.body);
    var settingsURL = req.body.get_settings;
    var transactionURL = req.body.add_transaction;
    var placeOrderURL = req.body.place_order;
    var getOrderURL = req.body.get_orders;
    var updateOrderStatusURL = req.body.update_order_status;
    var updateOrderItemStatusURL = req.body.update_order_item_status;

    var response = {
        "error": true,
        "message": null,
    };


    if (settingsURL == 1) {
        models.setting.findOne({}).lean().exec((err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
                res.send(response);
            } else {
                result.is_version_system_on = result.version_status_check;
                result.delivery_charge = 30;
                response.error = false;
                response.message = "data found!!";
                response.settings = result;
                res.send(response);
                console.log(response);
            }
        });
    } else if (transactionURL == 1) {
        console.log(req.body);

        let userID = req.body.user_id;
        let orderID = req.body.order_id;
        let type = req.body.type;
        let txnID = req.body.txn_id;
        let amount = req.body.amount
        let status = req.body.status;
        let message = req.body.message;
        let txnDate = req.body.transaction_date;

        var transaction = models.transaction({
            user_id: userID,
            order_id: orderID,
            type: type,
            txn_id: txnID,
            amount: amount,
            status: status,
            message: message,
            transaction_date: txnDate,
            date_created: Date.now(),
        });

        transaction.save((err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
            } else {
                response.error = false;
                response.message = "transaction added successfully!!";
                res.send(response);
            }
        });

    } else if (placeOrderURL == 1) {
        console.log(req.body.promo_code);
        console.log(req.body.promo_discount);
        var userID = req.body.user_id;
        var taxPercent = req.body.tax_percentage;
        var taxAmt = req.body.tax_amount;
        var total = req.body.total;
        var finalTotal = req.body.final_total;
        var productVariantID = req.body.product_variant_id;
        var quantity = req.body.quantity;
        var mobile = req.body.mobile;
        var deliveryCharge = req.body.delivery_charge;
        var deliveryTime = req.body.delivery_time;
        var walletUsed = req.body.wallet_used;
        var walletBalance = req.body.wallet_balance;
        var paymentMethod = req.body.payment_method;
        var promoCode = req.body.promo_code;
        var promoDiscount = req.body.promo_discount;
        var address = req.body.address;
        var longitude = req.body.longitude;
        var latitude = req.body.latitude;
        var email = req.body.email;
        var productVariantsString = productVariantID.replace("[", "").replace("]", "").replace(/['"]+/g, '');
        var productVariantIDArray = productVariantsString.split(",");
        var quantityString = quantity.replace("[", "").replace("]", "").replace(/['"]+/g, '');
        var quantityArray = quantityString.split(",");


        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        var statusArray = ["recived", today];




        models.user.findById(userID, (userError, user) => {
            if (userError) {
                console.log(userError);
                response.error = true;
                response.message = "some error occoured!!";
                res.send(response);
            } else {

                let order = models.order({
                    user_id: userID,
                    user_name: user.name,
                    delivery_boy_id: "",
                    mobile: mobile,
                    total: total,
                    delivery_charge: deliveryCharge,
                    tax_amount: taxAmt,
                    tax_percentage: taxPercent,
                    wallet_balance: walletBalance,
                    discount: promoDiscount,
                    promo_code: promoCode,
                    promo_discount: promoDiscount,
                    final_total: finalTotal,
                    payment_method: paymentMethod,
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                    delivery_time: deliveryTime,
                    status: statusArray.toString(),
                    active_status: "Recived",
                    date_added: Date.now(),
                });

                order.save((err, result) => {
                    if (err) {
                        console.log(err);
                        response.error = true;
                        response.message = "some error occoured!!";
                        res.send(response);
                    } else {
                        for (let i = 0; i < productVariantIDArray.length; i++) {
                            models.productVariant.findById(productVariantIDArray[i], (err2, result2) => {
                                if (err2) {
                                    console.log(err2);
                                    response.error = true;
                                    response.message = "some error occoured!!";
                                    res.send(response);
                                } else {
                                    models.product.findById(result2.product_id, (err3, result3) => {

                                        if (err3) {
                                            console.log(err3);
                                            response.error = true;
                                            response.message = "some error occoured!!";
                                            res.send(response);
                                        } else {
                                            var orderItems = models.orderItem({
                                                user_id: userID,
                                                order_id: result.id,
                                                name: result3.name,
                                                image: result3.image,
                                                measurement: result2.measurement,
                                                unit: result2.measurement_unit_name,
                                                product_variant_id: result2.id,
                                                quantity: quantityArray[i],
                                                price: result2.price,
                                                discounted_price: result2.discounted_price,
                                                discount: promoDiscount,
                                                sub_total: total,
                                                deliver_by: "",
                                                status: statusArray.toString(),
                                                active_status: "Recived",
                                                date_added: Date.now(),
                                            });

                                            orderItems.save((err4, result4) => {
                                                if (err4) {
                                                    console.log(err4);
                                                    response.error = true;
                                                    response.message = "some error occoured!!";
                                                    if (i == productVariantIDArray.length - 1) {
                                                        res.send(response);
                                                    }
                                                } else {
                                                    response.error = false;
                                                    response.order_id = result.id;
                                                    response.message = "order placed successfully!!";
                                                    if (i == productVariantIDArray.length - 1) {
                                                        res.send(response);
                                                        services.sendNotification(user.fcm_id, "Order placed!!", "Order placed successfully!!");
                                                    }
                                                }
                                            });


                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });


    } else if (getOrderURL == 1) {
        var userID = req.body.user_id;

        models.order.find({user_id: userID}).lean().exec((err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
                res.send(response);
            } else {

                var orderStatus = [];
                var orderItemStatus = [];

                console.log(result);
                for (let i = 0; i < result.length; i++) {

                    models.orderItem.find({order_id: result[i]._id}).lean().exec((err2, result2) => {
                        if (err2) {
                            console.log(err2);
                            response.error = true;
                            response.message = "some error occoured!!";
                            res.send(response);
                        } else {
                            models.user.findById(userID, (err3, result3) => {
                                if (err3) {
                                    console.log(err3);
                                    response.error = true;
                                    response.message = "some error occoured!!";
                                    res.send(response);
                                } else {

                                    orderStatus = [];

                                    var oStatus = result[i].status.split(",");
                                    for (let m = 0; m < oStatus.length; m++) {
                                        let oTempArray = [];
                                        if (m % 2 != 0) {
                                            oTempArray.push(oStatus[m - 1]);
                                            oTempArray.push(oStatus[m]);
                                            orderStatus.push(oTempArray);
                                        }
                                    }

                                    orderStatus = orderStatus.filter((n) => {
                                        return Array.isArray(n) && n.length != 0
                                    });

                                    console.log(orderStatus);
                                    result[i].status = orderStatus;
                                    result[i].user_name = result3.name;
                                    result[i].discount_rupees = 20
                                    result[i].items = result2;
                                    for (let j = 0; j < result2.length; j++) {
                                        // for (let l = 0; l < result2[j].status; l++) {
                                        //     var array = [];
                                        //     if (k % 2 == 0) {
                                        //         array.push(result2[j].status[l - 1]);
                                        //         array.push(result2[j].status[l]);
                                        //     }
                                        //     orderItemStatus.push(array);
                                        // }

                                        orderItemStatus = [];

                                        var oItemStatus = result2[j].status.split(",");

                                        for (let m = 0; m < oItemStatus.length; m++) {
                                            let oTempArray = [];
                                            if (m % 2 != 0) {
                                                oTempArray.push(oItemStatus[m - 1]);
                                                oTempArray.push(oItemStatus[m]);
                                                orderItemStatus.push(oTempArray);
                                            }
                                        }

                                        orderItemStatus = orderItemStatus.filter((n) => {
                                            return Array.isArray(n) && n.length != 0
                                        });

                                        result2[j].status = orderItemStatus;
                                        if (i == result.length - 1 && j == result2.length - 1) {
                                            response.error = false;
                                            response.message = "Data found!!";
                                            response.data = result;
                                            res.send(response);
                                            console.log(response);
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    } else if (updateOrderStatusURL == 1) {
        var orderID = req.body._id;
        var status = req.body.status;
        if (status == "cancelled") {
            models.order.findById(orderID, (err, result) => {
                if (err) {
                    console.log(err);
                    response.error = true;
                    response.message = "some error occoured!!";
                    res.send(response);
                } else {
                    var statusArray = result.status.split(",");
                    statusArray.push("cancelled");
                    statusArray.push(Date.now());
                    var update = {
                        "status": statusArray.toString(),
                        "active_status": "cancelled",
                    };
                    models.order.findByIdAndUpdate(orderID, update, (err2, result2) => {
                        if (err2) {
                            console.log(err2)
                            response.error = true;
                            response.message = "some error occoured!!";
                            res.send(response);
                        } else {
                            models.orderItem.find({order_id: orderID}, (err3, result3) => {
                                if (err3) {
                                    console.log(err3);
                                    response.error = true;
                                    response.message = "some error occoured!!";
                                    res.send(resposne);
                                } else {
                                    for (let i = 0; i < result3.length; i++) {
                                        models.orderItem.findByIdAndUpdate(result3[i].id, update, (err4, result4) => {
                                            if (err4) {
                                                console.log(err4);
                                                response.error = true;
                                                response.message = "some error occoured!!";
                                            } else {
                                                response.error = false;
                                                response.message = "order cancelled!!";
                                                res.send(response);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    } else if (updateOrderItemStatusURL == 1) {
        var orderItemID = req.body.order_item_id;
        var status = req.body.status;


        let orderItemStatusArray = [];

        models.orderItem.findById(orderItemID, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
                res.send(response);
            } else {
                orderItemStatusArray = result.status.split(",");
                orderItemStatusArray.push(status.toLowerCase());
                orderItemStatusArray.push(Date.now());

                let update = {
                    status: orderItemStatusArray.toString(),
                    active_status: status.toLowerCase(),
                };

                models.orderItem.findByIdAndUpdate(orderItemID, update, (err2, result2) => {
                    if (err2) {
                        console.log(err2);
                        response.error = true;
                        response.message = "some error occoured!!";
                        res.send(response);
                    } else {
                        models.order.findById(result.order_id, (err3, result3) => {
                            if (err) {
                                console.log(err);
                                console.log(err2);
                                response.error = true;
                                response.message = "some error occoured!!";
                                res.send(response);
                            } else {
                                let oldTotal = result3.total;
                                let oldTaxAmt = result3.tax_amount;
                                let oldFinalTotal = result3.final_total;
                                let newTotal = oldTotal -  result.discounted_price * result.quantity;
                                let newTax = (newTotal * result3.tax_percentage) / 100;
                                let newFinalTotal = newTotal + newTax;
                                let orderUpdate = {
                                    total: newTotal,
                                    tax_amount: newTax,
                                    final_total: newFinalTotal
                                };

                                models.order.findByIdAndUpdate(result.order_id, orderUpdate, (err4, result4) => {
                                    if (err4) {
                                        console.log(err4)
                                        console.log(err2);
                                        response.error = true;
                                        response.message = "some error occoured!!";
                                        res.send(response);
                                    } else {
                                        response.error = false;
                                        response.message = "order item cancelled successfully";
                                        res.send(response);
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

router.post("/api-firebase/validate-promo-code", (req, res) => {
    var promoCodeURL = req.body.validate_promo_code;
    // var userID = req.body.userID;
    var promoCode = req.body.promo_code;
    var total = req.body.total;

    var response = {
        "error": true,
        "message": null,
    };

    if (promoCodeURL == 1) {
        models.promoCode.find({promo_code: promoCode}, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
                res.send(response);
            } else if (result.length == 1) {
                response.error = false;
                response.message = "promo code applied successfully.";
                response.promo_code = promoCode;
                response.total = total;
                var discount = result.discount_type == "Amount" ? result[0].discount : ((total - 0) * result[0].discount) / 100;
                var discounted = (total - 0) - (discount - 0);
                response.discount = discount;
                response.discounted_amount = discounted;
                res.send(response);
            } else {
                response.error = true;
                response.message = "Invalid promo code!!";
                res.send(response);
            }
        });
    }
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

router.post("/api-firebase/products-search", (req, res) => {
    console.log(req.body);
    let productSearchURL = req.body.type;

    const response = {
        "error": false,
        "message": null,
        "data": null
    };


    var otherImages = [];


    if (productSearchURL == "products-search") {
        let searchQuery = req.body.search;

        // res.send(response);

        models.product.find({name: {$regex: ".*" + searchQuery + ".*"}}).lean().exec((err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occurred!! block 1";
                res.send(response);
            } else {
                for (let i = 0; i < result.length; i++) {
                    models.productVariant.find({product_id: result[i]._id}).lean().exec((err2, result2) => {
                        if (err2) {
                            console.log(err2);
                            response.error = true;
                            response.message = "some error occurred!! block 2";
                            res.send(response);
                        } else {
                            result[i].variants = result2;
                            result[i].other_images = otherImages;
                            response.error = false;
                            response.message = "data found!!";
                            response.data = result;

                            if (i == result.length - 1) {
                                console.log(response);
                                res.send(response);
                            }
                        }
                    });
                }
            }
        });

    }


});

module.exports = router;
