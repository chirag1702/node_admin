const models = require("../../models");

exports.login = (req, res) => {
    var mobileNumber = req.body.mobile;
    var password = req.body.password;
    var fcm_id = req.body.fcm_id;
    console.log(fcm_id);
    var query = {
        "mobile": mobileNumber,
        "password": password,
    };
    var response = {
        "error": true,
        "message": null,
        "user_id": null,
        "name": null,
        "email": null,
        "mobile": null,
        "country_code": null,
        "fcm_id": null,
        "dob": null,
        "city_id": null,
        "city_name": null,
        "area_id": null,
        "area_name": null,
        "street": null,
        "pincode": null,
        "referral_code": null,
        "friends_code": null,
        "latitude": null,
        "longitude": null,
        "apikey": null,
        "status": null,
        "created_at": null
    };
    models.user.find(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {

            console.log("response" + result.length);

            if (Array.isArray(result) && result.length == 1) {

                console.log(result);

                response.error = false;
                response.message = "User logged in successfully";
                response.user_id = result[0].id;
                response.name = result[0].name;
                response.email = result[0].email;
                response.mobile = result[0].mobile;
                response.country_code = result[0].country_code;
                response.fcm_id = result[0].fcm_id;
                response.dob = result[0].dob;
                // response.city = result3.id;
                response.city_name = result[0].city;
                // response.area_id = result2.id;
                response.area_name = result[0].area;
                response.street = result[0].street;
                response.pincode = result[0].pincode;
                response.referral_code = result[0].refferal_code;
                response.friends_code = result[0].friends_code;
                response.latitude = result[0].latitude;
                response.longitude = result[0].longitude;
                response.apikey = result[0].apikey;
                response.status = result[0].status;
                response.created_at = result[0].created_at;
                console.log(response);
                res.send(response);

            } else {
                console.log(result);
                response.error = true;
                response.message = "incorrect credentials";
                res.send(response);
            }


        }
    });
}

exports.register = (req, res) => {
    console.log("api accessed!!");

    var requestType = req.body.type;
    var mobileNumber = req.body.mobile;

    console.log(requestType);
    console.log(mobileNumber);

    var response = {
        "error": true,
        "_id": null,
        "message": null,
    };

    if (requestType == "verify-user") {
        models.user.find({mobile: mobileNumber}, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
            } else {

                console.log(result);

                if (result.length == 0) {
                    response.error = false;
                    response.message = "Ready to sent firebase OTP request!";
                    res.send(response);
                } else {

                    response.error = true;
                    response._id = result[0].id;
                    response.message = "This mobile is already registered. Please login!";
                    res.send(response);
                    console.log(response);
                }
            }
        });
    } else if (requestType == "register") {

        console.log("registration in process!!");

        var name = req.body.name;
        var email = req.body.email;
        var mno = req.body.mobile;
        var password = req.body.password;
        var pincode = req.body.pincode;
        var cityID = req.body.city_id;
        var areaID = req.body.area_id;
        var street = req.body.street;
        var longitude = req.body.longitude;
        var latitude = req.body.latitude;
        var country_code = req.body.country_code;
        var refferal_code = req.body.referral_code;
        var friends_code = req.body.friends_code;
        var fcm_id = req.body.fcm_id;

        var response = {
            "error": true,
            "message": null,
            "user_id": null,
            "name": null,
            "email": null,
            "mobile": null,
            "country_code": null,
            "fcm_id": null,
            "dob": null,
            "city_id": null,
            "city_name": null,
            "area_id": null,
            "area_name": null,
            "street": null,
            "pincode": null,
            "referral_code": null,
            "friends_code": null,
            "latitude": null,
            "longitude": null,
            "apikey": null,
            "status": null,
            "created_at": null
        };

        models.city.findById(cityID, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                models.area.findById(areaID, (err2, result2) => {
                    if (err2) {
                        console.log(err);
                    } else {
                        var user = models.user({
                            name: name,
                            email: email,
                            country_code: country_code,
                            mobile: mno,
                            dob: "",
                            city: result.name,
                            area: result2.name,
                            street: street,
                            pincode: pincode,
                            apikey: "",
                            balance: 0,
                            refferal_code: refferal_code,
                            friends_code: friends_code,
                            fcm_id: fcm_id,
                            latitude: latitude,
                            longitude: longitude,
                            password: password,
                            status: 1,
                            created_at: Date.now(),
                        });

                        user.save((err3, result3) => {
                            if (err3) {
                                console.log(err);
                                response.error = true;
                                response.message = "some error occoured!!";
                                res.send(response);
                            } else {
                                console.log("saved!!");
                                response.error = false;
                                response.message = "User registered successfully";
                                response.user_id = result3.id;
                                response.name = name;
                                response.email = email;
                                response.mobile = mno;
                                response.country_code = country_code;
                                response.fcm_id = fcm_id;
                                response.dob = "";
                                response.city_id = cityID;
                                response.city_name = result.name;
                                response.area_id = areaID;
                                response.area_name = result2.name;
                                response.street = street;
                                response.pincode = pincode;
                                response.referral_code = refferal_code;
                                response.friends_code = friends_code;
                                response.latitude = latitude;
                                response.longitude = longitude;
                                response.apikey = "";
                                response.status = 1;
                                response.created_at = Date.now();
                                console.log(response);
                                res.send(response);
                            }
                        });
                    }
                })
            }
        });


    } else if (requestType == "change-password") {

        var newPassword = req.body.password;
        var userID = req.body._id;

        var update = {
            password: newPassword,
        };

        var response = {
            "error": true,
            "message": null,
        };

        models.user.findByIdAndUpdate(userID, update, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!"
                res.send(response);
                console.log(response);
            } else {
                response.error = false;
                response.message = "profile updated successfully!!";
                res.send(response);
                console.log(response);
            }
        });

    } else if (requestType == "edit-profile") {

        var body = req.body;

        var userID = req.body._id;

        delete body['type'];
        delete body['_id'];

        var update = body;

        var response = {
            "error": true,
            "message": null,
        };

        models.user.findByIdAndUpdate(userID, update, (err, result) => {
            if (err) {
                console.log(err);
                response.error = true;
                response.message = "some error occoured!!";
                res.send(response);
                console.log(response);
            } else {
                response.error = false;
                response.message = "profile updated successfully!!";
                res.send(response);
                console.log(response);
            }
        });

    } else {
        console.log("none");

        var response = {
            "error": true,
            "message": null
        };

        res.send(response);

        console.log(response);
    }

}

exports.getUserData = (req, res) => {
    console.log(req.body);

    var userID = req.body.user_id;
    var response = {
        "error": true,
        "name": null,
        "email": null,
        "country_code": null,
        "mobile": null,
        "dob": null,
        "city": null,
        "area": null,
        "street": null,
        "pincode": null,
        "apikey": null,
        "balance": null,
        "refferal_code": null,
        "friends_code": null,
        "fcm_id": null,
        "latitude": null,
        "longitude": null,
        "password": null,
        "status": null,
        "created_at": null,
    };

    models.user.findById(userID, (err, result) => {
        if (err) {
            console.log(err);
            response.error = true;
            res.send(response);
            console.log(response);
        } else {

            console.log(result);

            if (result == null) {
                response.error = true;
                response.message = "no user found!!";
            } else {
                console.log("done!!");
                response.error = false;
                response.name = result.name;
                response.email = result.email;
                response.country_code = result.country_code;
                response.mobile = result.mobile;
                response.dob = result.dob;
                response.city = result.city;
                response.area = result.area;
                response.street = result.street;
                response.pincode = result.pincode;
                response.apikey = result.apikey;
                response.balance = result.balance;
                response.refferal_code = result.refferal_code;
                response.friends_code = result.friends_code;
                response.latitude = result.latitude;
                response.longitude = result.longitude;
                response.password = result.password;
                response.status = result.status;
                response.created_at = result.created_at;
                res.send(response);
                console.log(response);
            }
        }
    });
}
