const models = require("../../models");
const url = require("url");

exports.AddDeliveryBoy = (req, res) => {
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
}

exports.ManageDeliveryBoy = (req, res) => {
    models.deliveryBoy.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("delivery-boys/manage-delivery-boys", {data: result});
        }
    });
}

exports.DeleteDeliveryBoy = (req, res) => {
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
}