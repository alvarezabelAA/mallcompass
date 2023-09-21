const db = require('mysql');
const conn = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mallCompass'
});

conn.connect((error) => {
    if(error){
        console.log("error en el servidor");
    } else{
        console.log("servidor corriendo en mysql");
    }
});

module.exports = conn;
