const models = require("../../models");
const url = require("url");

exports.GetCities = (req, res) => {
    models.city.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("locations/cities", {data: result});
            console.log(result);
        }
    });
}

exports.GetAreas = (req, res) => {
    models.area.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("locations/areas", {data: result});
            console.log(result);
        }
    });
}

exports.AddCity = (req, res) => {
    var cityName = req.body.cityname;
    var city = new models.city({name: cityName});
    city.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/cities");
        }
    });
}

exports.AddArea = (req, res) => {
    var areaname = req.body.areaname;
    var cityName = req.body.city;
    var area = new models.area({name: areaname, city_name: cityName});
    area.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/areas");
        }
    });
}

exports.DeleteCity = (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.city.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/cities");
        }
    });
}

exports.DeleteArea = (req, res) => {
    var urlParsed = url.parse(req.url, true);
    var urlQuery = urlParsed.query;
    var id = urlQuery.id;
    models.area.findByIdAndRemove(id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/areas");
        }
    });
}