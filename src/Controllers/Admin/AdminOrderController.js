const models = require("../../models");
const url = require("url");
const services = require("../../services");

exports.ViewOrder = (req, res) => {
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
}

exports.updateOrder = (req, res) => {
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
}

exports.DeleteOrder = (req, res) => {
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
}

exports.GenerateInvoice = (req, res) => {
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
}