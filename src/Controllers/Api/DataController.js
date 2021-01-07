const models = require("../../models");

exports.getData = (req, res) => {

    let response = {
        "error": false,
        "message": null,
        "categories": null,
        "slider_images": null,
        "sections": null,
        "offer_images": null,
    };

    models.category.find({}, (err, result) => {
        if (err) {
            console.log(err);
            response.error = true;
            response.message = "some error occoured!!"
            res.send(response);
        } else {

            response.error = false;

            response.categories = result;

            models.slider.find({}, (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    response.error = true;
                    response.message = "some error occoured!!";
                    res.send(response);
                } else {
                    response.error = false;

                    response.slider_images = result2;

                    models.offer.find({}, (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                            response.error = true;
                            response.message = "some error occoured!!"
                            res.send(response);
                        } else {
                            response.offer_images = result3;

                            response.sections = [];

                            res.send(response);

                        }
                    });

                }
            });

        }
    });

}