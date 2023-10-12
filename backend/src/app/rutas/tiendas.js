const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { insertCC_Tienda, verificadorSesion } = require('./functions')

module.exports = (app) => {
  /* REGISTRO DE TIENDA*/
  app.options('/tiendas/registro', cors());
  app.post('/tiendas/registro', cors(),(req, res)=>{
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

            /*INSERT EN TABLA TIENDA*/
            let query = `INSERT INTO tiendas(nombreTienda, imagen, telefono, numeroLocal, estado_cuenta, categoriaTienda, correo) VALUES (?,?,?,?,?,?,?)`;
            const { nombreTienda, imagen, telefono, numeroLocal, estado_cuenta, categoriaTienda, correo } = req.body;
            const values = [nombreTienda, imagen, telefono, numeroLocal, estado_cuenta, categoriaTienda, correo];
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


  /*CONSULTA DE TODOS LAS TIENDAS */
  app.options('/tiendas/consultaGeneral', cors());
  app.get('/tiendas/consultaGeneral', cors(),(req, res)=>{
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
            
            let query = "SELECT * FROM tiendas";
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

  /*CONSULTA DATOS DE UNA SOLA TIENDA*/
  app.options('/tiendas/consulta', cors());
  app.get('/tiendas/consulta', cors(),(req, res)=>{
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

            let query = `SELECT * FROM tiendas WHERE id_tienda = '${req.query.idTienda}'`;
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



  /*MODIFICACION DATOS DE UNA SOLA TIENDA */
  app.options('/tiendas/modificacion', cors());
  app.put('/tiendas/modificacion', cors(),(req, res)=>{
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
            let query = `UPDATE tiendas SET nombreTienda=?,imagen=?,telefono=?,numeroLocal=?,estado_cuenta=?,categoriaTienda=?,correo=? WHERE id_tienda = '${req.query.idTienda}'`;
            const { nombreTienda, imagen, telefono, numeroLocal, estado_cuenta, categoriaTienda, correo } = req.body;
            const values = [nombreTienda, imagen, telefono, numeroLocal, estado_cuenta, categoriaTienda, correo];
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



  /*DELETE DE TIENDAS*/
  app.options('/tiendas/delete', cors());
  app.delete('/tiendas/delete', cors(),(req, res)=>{
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
            let query = `DELETE FROM tiendas WHERE id_tienda = ${req.query.idTienda}`;
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
}