const models = require("../../models");

exports.HandleDeliveryBoys = (req, res) => {
    console.log(req.body);

    if (req.body.login == 1){
        LoginDeliveryBoy(req, res);
    }

}

function LoginDeliveryBoy(req, res) {

    let response = {
        error: true,
        message: null,
        data: null
    };

    models.deliveryBoy.find({mobile: req.mobile, password: req.password}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length == 1) {
                response.error = false;
                response.message = "Delivery boy login successfully";

                res.send(response);
            } else {
                response.error = true;
                response.message = "Invalid cridentials";

                res.send(response);
            }
        }
    });
}