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

function insertUsuarios(usuario,rol,id_establecimiento){
 
  if(rol == "C"){
    console.log("se ejecuto C2");
    let query = `INSERT INTO rel_user_cc(id_usuario,id_centroComercial) VALUES (?,?)`;
    const values = [usuario, id_establecimiento];
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
    const values2 = [id_establecimiento, usuario];
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

/**/
function deleteUsuarios(id_usuario){
  const query = `DELETE FROM logintokens WHERE id_usuario = ?`;
  conn.query(query, [id_usuario], (error, result) => {
    if (error) {
      console.log("Error al eliminar el usuario");
    } else {
      if (result.affectedRows > 0) {
        console.log("Usuario eliminado de logintoken");
      } else {
        console.log("No se encontró ningún usuario con ese id_usuario");
      }
    }
  });


  const query2 = `SELECT * FROM usuarios WHERE id_usuario = ?`;
  conn.query(query2, [id_usuario], (error2, result2) => {
    if (error2) {
      console.log("Error de consulta en usuarios");
    } else {
      console.log("datos de usuario obtenidos");
      if(result2[0].rol == "C"){
        const query = `DELETE FROM rel_user_cc WHERE id_usuario = ?`;
        conn.query(query, [id_usuario], (error, result) => {
          if (error) {
            console.log("Error al eliminar el usuario");
          } else {
            if (result.affectedRows > 0) {
              console.log("Usuario eliminado de rel_user_cc");
            } else {
              console.log("No se encontró ningún usuario con ese id_usuario");
            }
          }
        });
      }else{
        if(result2[0].rol == "T"){
          const query = `DELETE FROM rel_user_tienda WHERE id_usuario = ?`;
          conn.query(query, [id_usuario], (error, result) => {
            if (error) {
              console.log("Error al eliminar el usuario");
            } else {
              if (result.affectedRows > 0) {
                console.log("Usuario eliminado de rel_user_tienda");
              } else {
                console.log("No se encontró ningún usuario con ese id_usuario");
              }
            }
          });
        }
      }
    }
  });
}



function hasheador(contrasena){
}

/*funciona que ejecuta delete en rel_cc_tiendas*/
function delete_REL_CC_TEINDAS(id_cc, id_tienda){
  var campo;

  if(id_cc != null){
    campo = "id_centroComercial";
  }else{
    if(id_tienda != null){
      campo = "id_tienda";
    }else{
      console.log("no se ingreso ningun ");
    }
  }

  const query = `DELETE FROM rel_cc_tiendas WHERE ${campo} = ?`;
  conn.query(query, [id_usuario], (error, result) => {
    if (error) {
      console.log("Error al eliminar el usuario");
    } else {
      if (result.affectedRows > 0) {
        console.log("Usuario eliminado de rel_cc_tiendas");
      } else {
        console.log(`No se encontró ningún usuario con ese ${campo}`);
      }
    }
  });
}

function accionProductos(id_tienda, id_producto, accion){
 
  if(accion == "insert"){
    console.log("se ejecuto insert");
    let query = `INSERT INTO rel_tiendas_productos(id_tienda,id_producto) VALUES (?,?)`;
    const values = [id_tienda, id_producto];
    conn.query(query, values, (error, filas) => {
      if (error) {
        console.log(`error en insert a rel_tiendas_productos`);
        console.log(error);
      } else {
        console.log(`insert en rel_tiendas_productos exitoso`);
      }
    });
  }
  
  if(accion == "delete"){
    console.log("se ejecuto delete");
    let query2 = `DELETE FROM rel_user_tienda WHERE id_producto=${id_producto}`;
    conn.query(query2, (error2, filas2) => {
      if (error2) {
        console.log(`error en delete a rel_user_tienda`);
        console.log(error2);
      } else {
        console.log(`delete exitoso en rel_user_tienda`);
      }
    });
  }
}

function accionPublicacion(id_post, id_lugar, accion, categoria){
 
  if(accion == "tienda"){
    console.log("se ejecuto insert en rel tienda");
    let query = `INSERT INTO rel_tiendas_publicaciones(id_post,id_tienda,categoria) VALUES (?,?,?)`;
    const values = [id_post, id_lugar, categoria];
    conn.query(query, values, (error, filas) => {
      if (error) {
        console.log(`error en insert a rel_tiendas_publicaciones`);
        console.log(error);
      } else {
        console.log(`insert en rel_tiendas_publicaciones exitoso`);
      }
    });
  }
  
  if(accion == "cc"){
    console.log("se ejecuto insert rel cc");
    let query = `INSERT INTO rel_cc_publicaciones(id_post,id_centroComercial,categoria) VALUES (?,?,?)`;
    const values = [id_post, id_lugar, categoria];
    conn.query(query, values, (error, filas) => {
      if (error) {
        console.log(`error en insert a rel_tiendas_publicaciones`);
        console.log(error);
      } else {
        console.log(`insert en rel_tiendas_publicaciones exitoso`);
      }
    });
  }
}


function accionPublicacionPromo(id_objeto, id_promocion, accion, categoria){
 
  if(accion == "tienda"){
    console.log("se ejecuto insert en rel promociones");
    let query = `INSERT INTO rel_tiendas_promociones(id_tienda,id_promocion,categoria) VALUES (?,?,?)`;
    const values = [id_objeto, id_promocion, categoria];
    conn.query(query, values, (error, filas) => {
      if (error) {
        console.log(`error en insert a rel_tiendas_promociones`);
        console.log(error);
      } else {
        console.log(`insert en rel_tiendas_promociones exitoso`);
      }
    });
  }
  
  if(accion == "usuario"){
    console.log("se ejecuto insert rel user");
    let query = `INSERT INTO rel_user_promociones(id_usuario,id_promocion) VALUES (?,?)`;
    const values = [id_objeto, id_promocion];
    conn.query(query, values, (error, filas) => {
      if (error) {
        console.log(`error en insert a rel_user_promociones`);
        console.log(error);
      } else {
        console.log(`insert en rel_user_promociones exitoso`);
      }
    });
  }
}


module.exports = {
  hasheador,
  tokenSesion,
  insertCC_Tienda,
  insertUsuarios,
  deleteUsuarios,
  accionProductos,
  accionPublicacion,
  accionPublicacionPromo
}