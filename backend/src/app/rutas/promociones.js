const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { accionPublicacionPromo } = require('./functions');
const { x64 } = require('crypto-js');

module.exports = (app) => {

  /*INGRESO PROMOCIONES TIENDA */
  app.options('/promociones/publicar', cors());
  app.post('/promociones/publicar', cors(),(req, res) => {
    console.log("ejecucion metodo POST");
    let query = `SELECT * FROM logintokens WHERE token = '${req.query.tokenSesion}'`;
    conn.query(query, (error, filas) => {
      if(error){
        console.log("No se encontró el token");
      }else{
        if(filas.length == 0){
          console.log("consulta sin elementos");
          res.json({ status: 0, mensaje: "error de token", datos: filas });
        }else{
          console.log("->encontro el token");
          if (!req.body.descripcion || !req.body.vigencia_inicio || !req.body.vigencia_final || !req.body.timer || !req.body.cantidad || !req.body.imagen  || !req.body.precio) {
            res.json({ status: 0, mensaje: "error datos enviados", descripcion: "algun campo enviado se encuentra vacío" });
            return;
          }
                        
          let query = `INSERT INTO promociones(descripcion, vigencia_inicio, vigencia_final, timer, cantidad, imagen, qr, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          const values = [req.body.descripcion, req.body.vigencia_inicio, req.body.vigencia_final, req.body.timer, req.body.cantidad, req.body.imagen, req.body.qr, req.body.precio];
                        
          conn.query(query, values, (error, filas) => {
            if (error) {
              res.json({ status: 0, mensaje: "error en DB", datos: error });
            } else {
              const id_promocion = filas.insertId;
              res.json({ status: 1, mensaje: "datos insertados en DB", datos: { id_promocion } });
              accionPublicacionPromo(req.query.id_tienda, filas.insertId, "tienda", req.body.categoria);
            }
          });
        }
      }
    });
  });

  app.options('/promociones/publicarUpdate', cors());
  app.post('/promociones/publicarUpdate', cors(), (req, res) => {
    console.log("Ejecución del método POST");

    const tokenQuery = `SELECT * FROM logintokens WHERE token = '${req.query.tokenSesion}'`;

    conn.query(tokenQuery, (tokenError, tokenRows) => {
      if (tokenError) {
        console.log("Error al buscar el token:", tokenError);
        res.json({ status: 0, mensaje: "Error de token", datos: tokenError });
      } else {
        if (tokenRows.length === 0) {
          console.log("Consulta sin elementos");
          res.json({ status: 0, mensaje: "Error de token", datos: tokenRows });
        } else {
          console.log("Token encontrado");

          if (!req.body.id_promocion) {
            res.json({ status: 0, mensaje: "Error datos enviados", descripcion: "No se proporcionó el ID de la promoción" });
            return;
          }

          // Realiza el UPDATE para restar 1 a la cantidad actual
          const updateQuery = 'UPDATE promociones SET cantidad = cantidad - 1 WHERE id_promocion = ?';
          const updateValues = [req.body.id_promocion];

          conn.query(updateQuery, updateValues, (updateError, updateResult) => {
            if (updateError) {
              res.json({ status: 0, mensaje: "Error al actualizar cantidad", datos: updateError });
            } else {
              res.json({ status: 1, mensaje: "Cantidad actualizada con éxito" });
            // Puedes realizar acciones adicionales después del UPDATE si es necesario
            }
          });
        }
      }
    });
  });


  app.options('/promociones/actualizar-qr', cors());
  app.post('/promociones/actualizar-qr', cors(), (req, res) => {
    console.log("Ejecución método POST para actualizar QR");

    let query = `SELECT * FROM logintokens WHERE token = '${req.query.tokenSesion}'`;
    conn.query(query, (error, filas) => {
      if (error) {
        console.log("No se encontró el token");
      } else {
        if (filas.length === 0) {
          console.log("Consulta sin elementos");
          res.json({ status: 0, mensaje: "Error de token", datos: filas });
        } else {
          console.log("Encontró el token");

          if (!req.body.id_promocion || !req.body.qr) {
            res.json({ status: 0, mensaje: "Error en datos enviados", descripcion: "Algún campo enviado se encuentra vacío" });
            return;
          }

          let updateQuery = `UPDATE promociones SET qr = ? WHERE id_promocion = ?`;
          const updateValues = [req.body.qr, req.body.id_promocion];

          conn.query(updateQuery, updateValues, (updateError, updateResult) => {
            if (updateError) {
              res.json({ status: 0, mensaje: "Error en la actualización del QR en DB", datos: updateError });
            } else {
              res.json({ status: 1, mensaje: "QR actualizado en DB", datos: updateResult });
            }
          });
        }
      }
    });
  });



  /*CONSULTA PROMO DE TIENDA */
  app.options('/promociones/publicar', cors());
  app.get('/promociones/publicar', cors(),(req, res)=>{
    console.log("ejecucion metodo GET");
    let query = `SELECT * FROM logintokens WHERE token = '${req.query.tokenSesion}'`;
    conn.query(query, (error, filas) => {
      if(error){
        console.log("No se encontró el token");
      }else{
        if(filas.length == 0){
          console.log("consulta sin elementos");
          res.json({ status: 0, mensaje: "error de token", datos: filas });
        }else{
          console.log("encontro el token");
          let query = `SELECT promociones.*, CONVERT(qr USING utf8) AS qr_convertido FROM promociones INNER JOIN rel_tiendas_promociones ON promociones.id_promocion =rel_tiendas_promociones.id_promocion WHERE id_tienda = '${req.query.id_tienda}'`;
          conn.query(query, (error, filas) => {
            if(error){
              res.json({ status: 0, mensaje: "error en DB", datos:error });
            }else{
              if(filas.length == 0){
                console.log("consulta sin elementos");
                res.json({ status: 0, mensaje: "no hay publicaciones", datos: filas });
              }else{
                res.json({ status: 1, mensaje: "datos obtenidos", datos: filas });
              }
            }
          });
        }
      }
    });
  });


  /*CONSULTA PROMO DE TODAS LAS TIENDAS */
  app.options('/promociones/publicar/general', cors());
  app.get('/promociones/publicar/general', cors(),(req, res)=>{
    console.log("ejecucion metodo GET");
    let query = `SELECT * FROM logintokens WHERE token = '${req.query.tokenSesion}'`;
    conn.query(query, (error, filas) => {
      if(error){
        console.log("No se encontró el token");
      }else{
        if(filas.length == 0){
          console.log("consulta sin elementos");
          res.json({ status: 0, mensaje: "error de token", datos: filas });
        }else{
          console.log("encontro el token");
          let query = `SELECT promociones.*, CONVERT(qr USING utf8) AS qr_convertido FROM promociones INNER JOIN rel_tiendas_promociones ON promociones.id_promocion =rel_tiendas_promociones.id_promocion`;
          conn.query(query, (error, filas) => {
            if(error){
              res.json({ status: 0, mensaje: "error en DB", datos:error });
            }else{
              if(filas.length == 0){
                console.log("consulta sin elementos");
                res.json({ status: 0, mensaje: "no hay publicaciones", datos: filas });
              }else{
                res.json({ status: 1, mensaje: "datos obtenidos", datos: filas });
              }
            }
          });
        }
      }
    });
  });



}