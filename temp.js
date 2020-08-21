var db = require('./db_operations');

console.log(db.getRowCount({ "username" : "admin", "password" : "admin" }, "admin"));