const models = require("../../models");
const url = require("url");

exports.GetStoreSettings = (req, res) => {
    models.setting.findOne({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.render("settings", {data: result});
        }
    });
}

exports.GetPaymentMethods = (req, res) => {
    models.paymentSettings.findOne((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("system/payment-methods", {data: result});
            console.log(result);
        }
    });
}

exports.GetTimeSlots = (req, res) => {
    models.timeSlot.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("system/time-slots", {data: result});
        }
    });
}

exports.UpdateSettings = (req, res) => {
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
}

exports.UpdatePaymentSettings = (req, res) => {
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
}

exports.AddTimeSlots = (req, res) => {
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
}

exports.DeleteTimeSlots = (req, res) => {
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
}