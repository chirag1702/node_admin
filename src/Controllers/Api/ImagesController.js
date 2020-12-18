const models = require("../../models");

exports.getSections = (req, res) => {
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
}

exports.getSliderImages = (req, res) => {
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
}

exports.getOfferImages = (req, res) => {
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
}
