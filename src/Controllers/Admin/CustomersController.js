const models = require("../../models");
const url = require("url");

exports.GetCustomers = (req, res) => {
    models.user.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("customers/customers", {data: result});
        }
    });
}

exports.AddWallet = (req, res) => {
    var customerName = req.body.customer;
    var txnType = req.body.type;
    var amount = req.body.amount;
    var message = req.body.message;
    var newAmount;
    var oldAmount;
    models.user.findOne({name: customerName}).select("balance -_id").exec((err, result) => {
        if (err) {
            console.log(err);
        } else {
            oldAmount = result.balance;
            console.log(oldAmount);
            if (txnType == "credit") {
                newAmount = (oldAmount - 0) + (amount - 0); //subtraction is done because js don't support addition
                models.user.updateOne({name: customerName}, {$set: {balance: newAmount}}, (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(doc);
                    }
                });
            } else if (txnType == "debit") {
                newAmount = oldAmount - amount;
                models.user.updateOne({name: customerName}, {$set: {balance: newAmount}}, (err, docu) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(docu);
                    }
                });
            }
        }

        var transaction = models.walletTransaction({
            user_id: result.id,
            type: txnType,
            amount: amount,
            message: message,
            status: result.status,
            date_created: Date.now(),
            last_updated: Date.now(),
        });

        transaction.save((err, resul) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("manage-customer-wallet");
            }
        });

    });
}

