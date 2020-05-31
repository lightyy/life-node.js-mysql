var mysql = require("mysql");

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ektgha0",
  database: "opentutorials",
});
db.connect();

module.exports = db;