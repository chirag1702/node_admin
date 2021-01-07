const Constants = require("../../../../src/config");
const models = require("../../../../src/models");
const axios = require("axios");

exports.isActive = () => {
    models.setting.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0].sclkey == null) {
                return false;
            } else {
                // axios({
                //     method: "post",
                //     url: "api_url_here",
                //     data: {
                //         domainName: Constants.DOMAIN_NAME,
                //         md5key = result[0].sclkey
                //     }
                // }).then((response) => {
                //     console.log(response);
                // }).catch((error) => {
                //     console.log(error);
                // });

                return true;
            }
        }
    });
}