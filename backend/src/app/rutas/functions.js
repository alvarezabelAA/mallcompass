const bcrypt = require('bcrypt'); /*funcion hash*/
const crypto = require('crypto');
const conn = require('../../config/database');
const CryptoJS = require("crypto-js");

function tokenSesion(correo, contra){
    var hash = CryptoJS.MD5(`${correo}${contra}`).toString();
    let query = `INSERT INTO logintokens(token, correo) VALUES (?,?)`;
    console.log(`correo token -> ${correo}`);
    const values = [hash, correo];
    conn.query(query, values, (error, filas) => {
        if (error) {
            console.log("error en insert a loginTokens");
            console.log(error);
        } else {
            console.log("insert en loginTokens exitoso");
        }
    });
    return hash
}


function hasheador(contrasena){
}

module.exports = {
    hasheador,
    tokenSesion
}