const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { accionPublicacion } = require('./functions');
const { x64 } = require('crypto-js');

module.exports = (app) => {
  /* CENTRO COMERCIAL--------------------------------------------------*/
  /*CONSULTA POST DE CC */
  app.options('/centroComercial/post', cors());
  app.get('/centroComercial/post', cors(),(req, res)=>{
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
          let query = `SELECT * FROM publicaciones INNER JOIN rel_cc_publicaciones ON publicaciones.id_post=rel_cc_publicaciones.id_post WHERE id_centroComercial = '${req.query.id_centroComercial}'`;
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


  /* PUBLICACION DE POST DE CC*/
  /*
    -body[req.body.descripcion, req.body.actividad, req.body.vigencia_inicio, req.body.vigencia_final, req.body.imagen, req.body.categoria]
    -query[id_centroComercial]
    -
    */
  app.options('/centroComercial/post/publicar', cors());
  app.post('/centroComercial/post/publicar', cors(),(req, res) => {
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
          if (!req.body.descripcion || !req.body.actividad || !req.body.vigencia_inicio || !req.body.vigencia_final || !req.body.imagen || !req.body.categoria) {
            res.json({ status: 0, mensaje: "error datos enviados", descripcion: "algun campo enviado se encuentra vacío" });
            return;
          }
                        
          let query = `INSERT INTO publicaciones(descripcion, actividad, vigencia_inicio, vigencia_final, imagen) VALUES (?, ?, ?, ?, ?)`;
          const values = [req.body.descripcion, req.body.actividad, req.body.vigencia_inicio, req.body.vigencia_final, req.body.imagen];
                        
          conn.query(query, values, (error, filas) => {
            if (error) {
              res.json({ status: 0, mensaje: "error en DB", datos: error });
            } else {
              res.json({ status: 1, mensaje: "datos insertados en DB", datos: [] });
              accionPublicacion(filas.insertId, req.query.id_centroComercial, "cc", req.body.categoria);
            }
          });
        }
      }
    });
  });

  /*TIENDAS--------------------------------------------------------------*/

  /*CONSULTA POST DE TIENDA */
  app.options('/tiendas/post', cors());
  app.get('/tiendas/post', cors(),(req, res)=>{
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
          let query = `SELECT * FROM publicaciones INNER JOIN rel_tiendas_publicaciones ON publicaciones.id_post=rel_tiendas_publicaciones.id_post WHERE id_tienda = '${req.query.id_tienda}'`;
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


  /* PUBLICACION DE POST DE TIENDA*/
  app.options('/tiendas/post/publicar', cors());
  app.post('/tiendas/post/publicar', cors(),(req, res) => {
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
          console.log("encontro el token");
          if (!req.body.descripcion || !req.body.actividad || !req.body.vigencia_inicio || !req.body.vigencia_final || !req.body.imagen || !req.body.categoria) {
            res.json({ status: 0, mensaje: "error datos enviados", descripcion: "algun campo enviado se encuentra vacío" });
            return;
          }
                        
          let query = `INSERT INTO publicaciones(descripcion, actividad, vigencia_inicio, vigencia_final, imagen) VALUES (?, ?, ?, ?, ?)`;
          const values = [req.body.descripcion, req.body.actividad, req.body.vigencia_inicio, req.body.vigencia_final, req.body.imagen];
                        
          conn.query(query, values, (error, filas) => {
            if (error) {
              res.json({ status: 0, mensaje: "error en DB", datos: error });
            } else {
              res.json({ status: 1, mensaje: "datos insertados en DB", datos: [] });
              accionPublicacion(filas.insertId, req.query.id_tienda, "tienda", req.body.categoria);
            }
          });
        }
      }
    }); 
  });


  app.options('/publicaciones', cors());
  app.get('/publicaciones', cors(), (req, res) => {
    console.log("Ejecución método GET");
  
    const tokenQuery = `SELECT * FROM logintokens WHERE token = '${req.query.tokenSesion}'`;
      
    conn.query(tokenQuery, (errorToken, tokenFilas) => {
      if (errorToken) {
        console.log("Error al buscar el token:", errorToken);
        return res.json({ status: 0, mensaje: "Error de token", datos: errorToken });
      }
  
      if (tokenFilas.length === 0) {
        console.log("Token no encontrado");
        return res.json({ status: 0, mensaje: "Token no encontrado", datos: tokenFilas });
      }
  
      console.log("Token encontrado");
  

      const query = `
      SELECT DISTINCT *
      FROM publicaciones
      LEFT JOIN rel_cc_publicaciones ON publicaciones.id_post = rel_cc_publicaciones.id_post
      LEFT JOIN rel_tiendas_publicaciones ON publicaciones.id_post = rel_tiendas_publicaciones.id_post
  `;
          
      conn.query(query, (error, filas) => {
        if (error) {
          console.log("Error al buscar publicaciones:", error);
          return res.json({ status: 0, mensaje: "Error en DB", datos: error });
        }
  
        if (filas.length === 0) {
          console.log("No hay publicaciones");
          return res.json({ status: 0, mensaje: "No hay publicaciones", datos: filas });
        }
  
        console.log("Publicaciones encontradas");
  
        const filasCC = filas.filter(fila => fila.id_post_cc !== null);
        const filasTienda = filas.filter(fila => fila.id_post_tienda !== null);
  
        return res.json({ status: 1, mensaje: "Datos obtenidos", datosTienda: filasTienda, datosCC: filasCC });
      });
    });
  });
  
  
    
}