const models = require("../../models");
const axios = require("axios");

exports.AdminLogin = (req, res) => {
    let username = req.body.username;
    let password = req.body.userpassword;

    models.admin.find({ username: username, password: password }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length == 1) {

                axios({
                    method: "post",
                    url: "http://dev.infinitelendingsalessolutions.net/?licence=222222&domain=222222"
                }).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.log(error);
                });
                res.redirect("/home");
            } else {

                let info = {
                    error: true
                };
                res.render("Authentication/pages-login", { data: info });
            }
        }
    });
}
