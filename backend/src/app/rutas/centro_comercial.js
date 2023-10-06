const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { tokenSesion, verificadorSesion } = require('./functions')

module.exports = (app) => {

    /* REGISTRO DE CENTRO COMERCIAL*/
    app.options('/centroComercial/registro', cors());
    app.post('/centroComercial/registro', cors(),(req, res)=>{
      console.log("ejecucion metodo POST");
      console.log("ejecucion metodo GET");
        let query = `SELECT * FROM logintokens WHERE token = '${req.query.token}'`;
        conn.query(query, (error, filas) => {
          if(error){
            console.log("No se encontró el token");
          }else{
            if(filas.length == 0){
              console.log("consulta sin elementos");
              res.json({ status: 1, mensaje: "error de token", datos: filas });
            }else{
              console.log("encontro el token");
              let query = `INSERT INTO centro_comercial(estado_cuenta, nombreCC, longitud, latitud, imagen, telefonoCC, correo, direccion) VALUES (?,?,?,?,?,?,?,?)`;
              const { estado_cuenta, nombreCC, longitud, latitud, imagen, telefonoCC, correo, direccion } = req.body;
              const values = [estado_cuenta, nombreCC, longitud, latitud, imagen, telefonoCC, correo, direccion];
              conn.query(query, values, (error, filas) => {
                if(error){
                    res.json({ status: 0, mensaje: "error en DB", datos:error });
                }else{
                    res.json({ status: 1, mensaje: "datos insertados en DB", datos: filas });
                }
              });
            }
          }
        });

    });


    /*CONSULTA DE TODOS LOS CENTROS COMERCIALES */ /*falta contador de tiendas */
    app.options('/centroComercial/consultaGeneral', cors());
    app.get('/centroComercial/consultaGeneral', cors(),(req, res)=>{
        console.log("ejecucion metodo GET");
        let query = `SELECT * FROM logintokens WHERE token = '${req.query.token}'`;
        conn.query(query, (error, filas) => {
          if(error){
            console.log("No se encontró el token");
          }else{
            if(filas.length == 0){
              console.log("consulta sin elementos");
              res.json({ status: 1, mensaje: "error de token", datos: filas });
            }else{
              console.log("encontro el token");
              
              let query = "SELECT * FROM centro_comercial";
              conn.query(query, (error, filas) => {
              if(error){
                  res.json({ status: 0, mensaje: "error en DB", datos:error });
              }else{
                  res.json({ status: 1, mensaje: "datos obtenidos", datos: filas });
              }
              });


            }
          }
        });
    });

    /*CONSULTA DATOS DE UN SOLO CC */
    app.options('/centroComercial/consulta', cors());
    app.get('/centroComercial/consulta', cors(),(req, res)=>{
        console.log("ejecucion metodo GET");
        let query = `SELECT * FROM logintokens WHERE token = '${req.query.token}'`;
        conn.query(query, (error, filas) => {
          if(error){
            console.log("No se encontró el token");
          }else{
            if(filas.length == 0){
              console.log("consulta sin elementos");
              res.json({ status: 1, mensaje: "error de token", datos: filas });
            }else{
              console.log("encontro el token");

              let query = `SELECT * FROM centro_comercial WHERE id_centroComercial = '${req.query.idComercial}'`;
              conn.query(query, (error, filas) => {
              if(error){
                  res.json({ status: 0, mensaje: "error en DB", datos:error });
              }else{
                  res.json({ status: 1, mensaje: "datos obtenidos", datos: filas });
              }
              });
            }
          }
        });

    });



    /*MODIFICACION DATOS DE UN SOLO CC */
    app.options('/centroComercial/modificacion', cors());
    app.put('/centroComercial/consulta', cors(),(req, res)=>{
        console.log("ejecucion metodo GET");
        let query = `SELECT * FROM logintokens WHERE token = '${req.query.token}'`;
        conn.query(query, (error, filas) => {
          if(error){
            console.log("No se encontró el token");
          }else{
            if(filas.length == 0){
              console.log("consulta sin elementos");
              res.json({ status: 1, mensaje: "error de token", datos: filas });
            }else{
              console.log("encontró el token");
              let query = `UPDATE centro_comercial SET estado_cuenta=?,nombreCC=?,longitud=?,latitud=?,imagen=?,telefonoCC=?,correo=?,direccion=? WHERE id_centroComercial = '${req.query.idComercial}'`;
              const { estado_cuenta, nombreCC, longitud, latitud, imagen, telefonoCC, correo, direccion } = req.body;
              const values = [estado_cuenta, nombreCC, longitud, latitud, imagen, telefonoCC, correo, direccion];
              conn.query(query, values, (error, filas) => {
              if(error){
                  res.json({ status: 0, mensaje: "error en DB", datos:error });
              }else{
                  res.json({ status: 1, mensaje: "datos actualizados en DB", datos: filas });
              }
              });
            }
          }
        });

    });
}