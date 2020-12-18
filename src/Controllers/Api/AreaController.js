const models = require("../../models");

exports.getCities = (req, res) => {
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
}

exports.getAreaByCityID = (req, res) => {
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
}
