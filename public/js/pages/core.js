const AuthFile = require("./Auth-folder/AuthFile");

exports.show = () => {
    if (AuthFile.isActive()) {
        return true;
    } else {
        return false;
    }
}

exports.destroy = (res) => {
    res.redirect("/activate");
}