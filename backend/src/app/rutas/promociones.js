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
                    if (!req.body.descripcion || !req.body.vigencia_inicio || !req.body.vigencia_final || !req.body.timer || !req.body.cantidad || !req.body.imagen || !req.body.qr || !req.body.precio) {
                        res.json({ status: 0, mensaje: "error datos enviados", descripcion: "algun campo enviado se encuentra vacío" });
                        return;
                    }
                        
                    let query = `INSERT INTO promociones(descripcion, vigencia_inicio, vigencia_final, timer, cantidad, imagen, qr, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const values = [req.body.descripcion, req.body.vigencia_inicio, req.body.vigencia_final, req.body.timer, req.body.cantidad, req.body.imagen, req.body.qr, req.body.precio];
                        
                    conn.query(query, values, (error, filas) => {
                        if (error) {
                            res.json({ status: 0, mensaje: "error en DB", datos: error });
                        } else {
                            res.json({ status: 1, mensaje: "datos insertados en DB", datos: [] });
                            accionPublicacionPromo(req.query.id_tienda, filas.insertId, "tienda", req.body.categoria);
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
                 let query = `SELECT * FROM promociones INNER JOIN rel_tiendas_promociones ON promociones.id_promocion =rel_tiendas_promociones.id_promocion WHERE id_tienda = '${req.query.id_tienda}'`;
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
                 let query = `SELECT * FROM promociones INNER JOIN rel_tiendas_promociones ON promociones.id_promocion =rel_tiendas_promociones.id_promocion`;
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