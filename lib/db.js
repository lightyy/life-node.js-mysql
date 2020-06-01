var mysql = require("mysql");

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ektgha0",
  database: "opentutorials",
  // multipleStatements : true,
});
db.connect();

module.exports = db;