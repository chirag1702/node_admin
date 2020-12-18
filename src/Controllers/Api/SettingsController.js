const models = require("../../models");

exports.getSettings = (req, res) => {
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
}
