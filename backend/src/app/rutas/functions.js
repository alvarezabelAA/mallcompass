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

function verificadorSesion(token){
  var verificador = "false";
  console.log("ejecucion verificadorSesion");
  let query = `SELECT * FROM logintokens WHERE token = '${token}'`;
  conn.query(query, (error, filas) => {
    if(error){
      console.log("No se encontró el token");
    }else{
      if(filas.length == 0){
      console.log("consulta sin elementos");
      verificador = "true";
      }else{
        console.log("encontro el token");
        verificador = "false";
      }
    }
    console.log(`verificador -> ${verificador}`);
  });
  return verificador;
}

function hasheador(contrasena){
}

module.exports = {
    hasheador,
    tokenSesion,
    verificadorSesion
}