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

function insertCC_Tienda(){
  
}

function insertUsuarios(tokenSesion,rol,id){
  let query = `SELECT * FROM usuarios INNER JOIN logintokens ON usuarios.correo=logintokens.correo WHERE token = '${tokenSesion}'`;
  conn.query(query, (error, filas) => {
    if(error){
      console.log("error en la consulta de DB");
    }else{
      var usuario = filas[0].id_usuario;
      console.log(`consulta en DB exitosa   ->  ${usuario}`);


      if(rol == "C"){
        console.log("se ejecuto C2");
        let query = `INSERT INTO rel_user_cc(id_usuario,id_centroComercial) VALUES (?,?)`;
        const values = [usuario, id];
        conn.query(query, values, (error, filas) => {
            if (error) {
                console.log(`error en insert a rel_user_cc`);
                console.log(error);
            } else {
                console.log(`insert en rel_user_cc exitoso`);
            }
        });
      }
      
      if(rol == "T"){
        console.log("se ejecuto T2");
        let query2 = `INSERT INTO rel_user_tienda(id_tienda,id_usuario) VALUES (?,?)`;
        const values2 = [id, usuario];
        conn.query(query2, values2, (error2, filas2) => {
            if (error2) {
                console.log(`error en insert a rel_user_tienda`);
                console.log(error2);
            } else {
                console.log(`insert en rel_user_tienda exitoso`);
            }
        });
      }
    }
  });


}

function hasheador(contrasena){
}

module.exports = {
    hasheador,
    tokenSesion,
    insertCC_Tienda,
    insertUsuarios
}