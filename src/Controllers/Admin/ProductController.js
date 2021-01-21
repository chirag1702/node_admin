const models = require("../../models");
const url = require("url");

exports.AddProduct = (req, res) => {
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
}

exports.AddTax = (req, res) => {
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
}

exports.DeleteTax = (req, res) => {
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
}

exports.UpdateTax = (req, res) => {
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
}

exports.AddCategory = (req, res) => {
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
}

exports.AddSubCategory = (req, res) => {
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
}

exports.AddUnit = (req, res) => {
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
                    res.redirect("/units");
            //         console.log(result);
            //     }
        }
    });
}

exports.DeleteCategory = (req, res) => {
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
}

exports.DeleteSubCategory = (req, res) => {
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
}

exports.AddPromoCode = (req, res) => {
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
}

exports.DeletePromoCode = (req, res) => {
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
}

exports.UpdatePromoCode = (req, res) => {
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
}