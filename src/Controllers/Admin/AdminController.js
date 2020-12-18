const models = require("../../models");

exports.AdminLogin = (req, res) => {
    let username = req.body.username;
    let password = req.body.userpassword;

    models.admin.find({username: username, password: password}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length == 1) {
                res.redirect("/home");
            } else {
                let info = {
                    error: true
                };
                res.render("Authentication/pages-login", {data: info});
            }
        }
    });
}
