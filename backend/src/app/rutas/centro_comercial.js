const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { tokenSesion, verificadorSesion } = require('./functions')

module.exports = (app) => {

    /* REGISTRO DE CENTRO COMERCIAL*/
    app.options('/centroComercial/registro', cors());
    app.post('/centroComercial/registro', cors(),(req, res)=>{
      console.log("ejecucion metodo POST");
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

              /* PRIMER INSERT TABLA CC*/
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



    /*CONSULTA DE TODOS LOS CENTROS COMERCIALES ACTIVOS */ /*falta contador de tiendas */
    app.options('/centroComercial/consultaGeneral/activo', cors());
    app.get('/centroComercial/consultaGeneral/activo', cors(),(req, res)=>{
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
              
              let query = "SELECT * FROM centro_comercial WHERE estado_cuenta= 'A'";
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
    app.put('/centroComercial/modificacion', cors(),(req, res)=>{
        console.log("ejecucion metodo PUT");
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


    /*DELETE DE CENTRO COMERCIAL*/
    app.options('/centroComercial/delete', cors());
    app.delete('/centroComercial/delete', cors(),(req, res)=>{
        console.log("ejecucion metodo DELETE");
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
              let query = `DELETE FROM centro_comercial WHERE id_centroComercial = ${req.query.idComercial}`;
              conn.query(query, (error, filas) => {
              if(error){
                  res.json({ status: 0, mensaje: "error en DB", datos:error });
              }else{
                var prueba;
                prueba = filas.affectedRows;
                if(prueba > 0){
                  res.json({ status: 1, mensaje: "datos eliminados en DB", datos: filas });
                }else{
                  res.json({status: 1, mensaje: "no existe el id en la DB", datos: filas});
                }
              }
              });
            }
          }
        });

    });





    /*Lista de CC especial*/
    app.options('/centroComercial/lista', cors());
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

              let query2 = `SELECT centro_comercial.*,
              IFNULL(count_tiendas, 0) AS cantidad_tiendas,
              IFNULL(count_usuarios, 0) AS cantidad_usuarios
              FROM centro_comercial
              LEFT JOIN (
                  SELECT id_centroComercial, COUNT(*) AS count_tiendas
                  FROM rel_cc_tiendas
                  GROUP BY id_centroComercial
              ) AS tiendas_count 
              ON centro_comercial.id_centroComercial = tiendas_count.id_centroComercial
              
              LEFT JOIN (
                  SELECT id_centroComercial, COUNT(*) AS count_usuarios
                  FROM rel_user_cc
                  GROUP BY id_centroComercial
              ) AS usuarios_count 
              ON centro_comercial.id_centroComercial = usuarios_count.id_centroComercial
              WHERE centro_comercial.estado_cuenta = 'A'
              HAVING cantidad_usuarios > 0
              LIMIT 0, 25`;
              conn.query(query2, (error2, filas2) => {
                if(error2){
                    res.json({ status: 0, mensaje: "error en DB", datos:error2 });
                }else{
                    res.json({ status: 1, mensaje: "datos obtenidos", datos: filas2 });
                }
              });
            }
          }
        });
      });


      /*Lista de CC usuarios especial*/
    app.options('/centroComercial/listaUsuarios', cors());
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


              let query2 = `SELECT centro_comercial.*,
              IFNULL(count_tiendas, 0) AS cantidad_tiendas,
              IFNULL(count_usuarios, 0) AS cantidad_usuarios
              FROM centro_comercial
              LEFT JOIN (
                  SELECT id_centroComercial, COUNT(*) AS count_tiendas
                  FROM rel_cc_tiendas
                  GROUP BY id_centroComercial
              ) AS tiendas_count 
              ON centro_comercial.id_centroComercial = tiendas_count.id_centroComercial
              
              LEFT JOIN (
                  SELECT id_centroComercial, COUNT(*) AS count_usuarios
                  FROM rel_user_cc
                  WHERE rel_user_cc.id_usuario = ${req.query.id_usuario}
                  GROUP BY id_centroComercial
              ) AS usuarios_count 
              ON centro_comercial.id_centroComercial = usuarios_count.id_centroComercial
              WHERE centro_comercial.estado_cuenta = 'A'
              HAVING cantidad_usuarios > 0
              LIMIT 0, 25`;
              conn.query(query2, (error2, filas2) => {
                if(error2){
                    res.json({ status: 0, mensaje: "error en DB", datos:error2 });
                }else{
                    res.json({ status: 1, mensaje: "datos obtenidos", datos: filas2 });
                }
              });
            }
          }
        });
      });



}