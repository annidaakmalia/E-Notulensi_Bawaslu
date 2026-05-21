//const mysql = require('mysql2');
//const db = mysql.createPool({
  //host: 'localhost',
  //user: 'root',
  //password: '', // default XAMPP kosong
  //database: 'e_notulen'
//});
//module.exports = db.promise();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "e_notulen"
});

db.connect((err) => {
  if (err) {
    console.log("Koneksi gagal:", err);
  } else {
    console.log("Database terhubung");
  }
});

module.exports = db;