//-----------------------------Author: Chirag Jangid  Created On: 18th August 2020--------------------
//-----------------------------Database operations are written here-----------------------------------
// ----------------------------Function List----------------------------------------------------------
// 1. addData()
// 2. deleteData()
// 3. updateData()
// 4. getRowCount()




const mongo = require('mongodb');
const mongoCient = mongo.MongoClient;
const DB_NAME = "ekart_DB"; //Your database name here
const DB_HOST = "127.0.0.1:27017/"; //Your database host here. Don't remove the /
const DB_URL = "mongodb://" + DB_HOST + DB_NAME; //Database URL

exports.addData = function add(data, collectionName) {
    mongoCient.connect(DB_URL, function(err, db) {  //Connecting to database
        if (err) {
            throw err; //throw error if got any
        }

        else { //else continue with data insertion
            var dbo = db.db(DB_NAME);
            dbo.collection(collectionName).insertOne(data, function (err) {
            if (err) {
                return false; //if insertion failes return false
            } 
            else {
                return true; //else return true if insertion is successfully completed
            }
        })
        }
    })
}

exports.deleteData = function delet(data, collectionName) {
    mongoCient.connect(DB_URL, function (err, db) { //connecting to database
        if (err) {
            throw err; //throw error if got any
        }

        else { //else continue with deletion
            var dbo = db.db(DB_NAME);
            dbo.collection(collectionName).deleteOne(data, function (err) {
            if (err) {
                return false; //if deletion failes return false
            }
            else {
                return true; //else return true if deletion is sucessfully completed
            }
        })
        }
    })
}

exports.updateData = function update(data, filter, collectionName) {
    mongoCient.connect(DB_URL, function (err, db) { //connecting to database
        if (err) {
            throw err; //throw error if got any
        }

        else { //else continue with updation
            var dbo = db.db(DB_NAME);
            dbo.collection(collectionName).updateOne(filter, data, function (err) {
                if (err) {
                    return false; //if updation failes return false
                }

                else {
                    return true; //else return true if deletion is successfully completed
                }
            })
        }
    })
}


//this function returns the record count returned by find() function. Although it is basically written to use for login, it is also used to check existing values while registering
exports.getRowCount = function getRow(data, collectionName) {
    var rowCount;
    mongoCient.connect(DB_URL, function (err, db) { //connecting to database
        if (err) {
            throw err; // throw error if got any
        }

        else { //else continue fetching records
            var dbo = db.db(DB_NAME);
            dbo.collection(collectionName).find(data).count( function (err, res) {
                if (err) {
                    throw err; //if error found throw it
                }

                else {
                    rowCount = res; //else set value to record count
                }
            })
        }

        return rowCount; // finish the call and return the record count
    })
}

// module.exports = addData();
// module.exports = deleteData();
// module.exports = updateData();
// module.exports = getRowCount();