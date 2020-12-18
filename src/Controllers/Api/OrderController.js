const services = require("../../services");
const models = require("../../models");

exports.processOrder = (req, res) => {
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
                                                        services.OrderRecivedEmail(user.email, user.name, result.id);
                                                        services.SendOrderPlacedNotification(user.fcm_id, result.id);
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
                                let newTotal = oldTotal - result.discounted_price * result.quantity;
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
}

exports.validatePromoCode = (req, res) => {
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
}
