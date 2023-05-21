const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'foods',
    port:3307,
});

con.connect(function(error) {
    if (error) throw error;
    console.log("first")
    });


module.exports = con;