const models = require("../../models");
const url = require("url");

exports.GetTransactions = (req, res) => {
    models.transaction.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("transaction", {data: result});
        }
    });
}

exports.GetWalletTransaction = (req, res) => {
    models.walletTransaction.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("wallet-transactions", {data: result});
        }
    });
}