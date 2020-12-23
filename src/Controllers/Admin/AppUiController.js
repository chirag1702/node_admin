const models = require("../../models");
const url = require("url");

exports.UploadSliderImage = (req, res) => {
    var type = req.body.type;
    var imagePath;
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on("fileBegin", (name, file) => {
        file.path = __dirname + "/public/images/uploads/" + file.name;
        imagePath = "/public/images/uploads/" + file.name;
    });
    form.on("file", (name, file) => {
        console.log("Uploaded" + imagePath);
        var sliderImage = models.slider({
            type: type,
            type_id: "type_id",
            image: imagePath,
            date_added: Date.now(),
        });

        sliderImage.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("home-slider-images");
            }
        });
    });
}

exports.UploadOfferImage = (req, res) => {
    var imagePath;
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on("fileBegin", (name, file) => {
        file.path = __dirname + "/public/images/uploads" + file.name;
        imagePath = "/public/images/uploads/" + file.name;
    });
    form.on("file", (name, file) => {
        console.log("uploaded" + imagePath);
        var offerImage = models.offer({
            image: imagePath,
            date_added: Date.now()
        });
        offerImage.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("new-offer-images");
            }
        });
    })
}

exports.DeleteOfferImage = (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.offer.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("new-offer-images");
        }

    });
}

exports.GetFeaturedSection = (req, res) => {
    models.section.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("featured-section", {data: result});
        }
    })
}

exports.AddFeaturedSection = (req, res) => {
    var sectionTitle = req.body.title;
    var sectionDescription = req.body.description;
    var sectionStyle = req.body.style;
    var productIDS = req.body.productids;
    var featuredSection = models.section({
        title: sectionTitle,
        short_description: sectionDescription,
        style: sectionStyle,
        product_ids: productIDS,
        date_created: Date.now()
    });

    featuredSection.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("featured-section");
        }
    });
}

exports.GetNewOfferImages = (req, res) => {
    models.offer.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("app-images/new-offer-images", {data: result});
        }
    });
}

exports.DeleteSliderImage = (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.slider.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("home-slider-images");
        }

    });
}

exports.DeleteFeaturedSection = (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.section.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("featured-section");
        }

    });
}