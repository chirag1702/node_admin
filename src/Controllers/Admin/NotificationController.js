const models = require("../../models");
const services = require("../../../src/services");

exports.RenderNotificationPage = (req, res) => {
    res.render("send-notification");
}

exports.SendNotification = (req, res) => {
    let notificationTitle = req.body.title;
    let notificationMessage = req.body.message;
    models.user.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            for (let i = 0; i < result.length; i++) {
                services.SendNotification(result[i].fcm_id, notificationTitle, notificationMessage);
                if (i == result.length - 1) {
                    res.redirect("/send-notification");
                }
            }
        }
    });
}