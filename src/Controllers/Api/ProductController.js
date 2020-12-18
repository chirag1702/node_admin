const models = require("../../models");

exports.getCategories = (req, res) => {
    console.log("api accessed");
    var response = {
        "error": true,
        "data": null,
        "message": null
    };
    models.category.find().lean().exec((err, result) => {
        if (err) {
            console.log(err)
        } else {

            response.error = false;
            response.data = result;

            // console.log(response);

        }

        res.send(response);
    });
}

exports.getSubCategoriesByCategoryID = (req, res) => {
    var category_id = req.body.category_id;

    var response = {
        "error": true,
        "message": null,
        "data": null,
    };

    models.subCategory.find({category_id: category_id}, (err, result) => {
        if (err) {
            console.log(err);
            response.error = true;
            response.message = "some error occoured!!";
            res.send(response);
        } else {
            response.error = false;
            response.data = result;
            res.send(response);
        }
    });
}

exports.getProductsBySubCategoryID = (req, res) => {
    var subcategoryid = req.body.subcategory_id;
    console.log(subcategoryid);
    var response = {
        "error": true,
        "total": null,
        "data": null,
    };

    var otherimages = [];

    models.product.find({sub_category_id: subcategoryid}).lean().exec((err, products) => {
        if (err) {
            console.log(err);
        } else {
            for (let index = 0; index < products.length; index++) {
                models.productVariant.find({product_id: products[index]._id}, (err2, result) => {
                    if (err2) {
                        console.log(err2);
                    } else {
                        response.error = false;
                        response.total = products.length;
                        products[index].variants = JSON.parse(JSON.stringify(result));
                        products[index].other_images = otherimages;
                        response.data = products;
                        if (index == products.length - 1) {
                            console.log("if executed")
                            console.log(response);
                            res.send(response);
                        }
                    }
                });
            }
        }
    });
}

exports.getProductByID = (req, res) => {
    console.log("get product by id!!");
    var productID = req.body.product_id;
    console.log(productID);

    var response = {
        "error": true,
        "data": null,
    };

    var images = [];

    var data = [];

    models.product.findById(productID).lean().exec((err, result) => {
        if (err) {
            response.error = true;
            res.send(response);
            console.log(err);
        } else {
            models.productVariant.find({product_id: productID}).lean().exec((err2, result2) => {
                if (err2) {
                    response.error = true;
                    res.send(response);
                    console.log(err2);
                } else {
                    result.variants = JSON.parse(JSON.stringify(result2));
                    result.other_images = images;
                    result2[0].serve_for = "Available";
                    response.error = false;
                    data.push(result);
                    response.data = data;
                    res.send(response);
                    console.log(response);
                    console.log(result2);
                }
            });
        }
    });
}

exports.search = (req, res) => {
    console.log(req.body);
    let productSearchURL = req.body.type;

    const response = {
        "error": false,
        "message": null,
        "data": null
    };


    var otherImages = [];


    if (productSearchURL == "products-search") {
        let searchQuery = req.body.search;

        // res.send(response);

        models.product.find({name: {$regex: ".*" + searchQuery + ".*"}}).lean().exec((err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occurred!! block 1";
                res.send(response);
            } else {
                for (let i = 0; i < result.length; i++) {
                    models.productVariant.find({product_id: result[i]._id}).lean().exec((err2, result2) => {
                        if (err2) {
                            console.log(err2);
                            response.error = true;
                            response.message = "some error occurred!! block 2";
                            res.send(response);
                        } else {
                            result[i].variants = result2;
                            result[i].other_images = otherImages;
                            response.error = false;
                            response.message = "data found!!";
                            response.data = result;

                            if (i == result.length - 1) {
                                console.log(response);
                                res.send(response);
                            }
                        }
                    });
                }
            }
        });

    }

}
