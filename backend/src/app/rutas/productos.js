const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { tokenSesion,insertUsuarios,deleteUsuarios,accionProductos } = require('./functions');
const { x64 } = require('crypto-js');

module.exports = (app) => {

  /*Insert de producto en tabla PRODUCTOS y REL relacionado a una tienda*/
  app.options('/productos/ingreso', cors());
  app.post('/productos/ingreso', cors(),(req, res)=>{
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
          console.log(`id tienda -> ${req.query.id_tienda}`)
          if( (req.query.id_tienda == undefined)){
            res.json({ status: 0, mensaje: "no ingreso id de tienda", datos:error });
          }else{
            if(req.query.id_tienda == 0){
              res.json({ status: 0, mensaje: "no ingreso id de tienda", datos:error });
            }else{
              let query = `INSERT INTO productos(existencia, descripcion, estado_producto, categoria, nombre, precio, imagen, qr) VALUES (?,?,?,?,?,?,?,?)`;
              const { existencia, descripcion, estado_producto, categoria, nombre, precio, imagen, qr } = req.body;
              const values = [existencia, descripcion, estado_producto, categoria, nombre, precio, imagen, qr];
              conn.query(query, values, (error, filas) => {
                if(error){
                  res.json({ status: 0, mensaje: "error en DB", datos:error });
                }else{
                  res.json({ status: 1, mensaje: "datos insertados en DB", datos: filas });
                  accionProductos(req.query.id_tienda, filas.insertId, "insert");
                }
              });
            }
          }

                
        }
      }
    });
  });



  /*LISTA DE PRODUCTOS DE UNA TIENDA*/
  app.options('/productos/tienda', cors());
  app.get('/productos/tienda', cors(),(req, res)=>{
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
          let query2 = `SELECT * FROM productos INNER JOIN rel_tiendas_productos ON productos.id_producto=rel_tiendas_productos.id_producto WHERE id_tienda = '${req.query.id_tienda}'`;
          conn.query(query2, (error2, filas2) => {
            if(error2){
              res.json({ status: 0, mensaje: "error en DB", datos:error2 });
            }else{
              if (filas2.length == 0) {
                res.json({ status: 0, mensaje: "no existe productos en la tienda indicada", datos: filas2 });
              }else{
                res.js
                
                on({ status: 1, mensaje: "datos obtenidos", datos: filas2 });
              }
            }
          });
        }
      }
    });
  });
}