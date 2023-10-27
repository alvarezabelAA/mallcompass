const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { tokenSesion,insertUsuarios,deleteUsuarios,accionProductos } = require('./functions');
const { x64 } = require('crypto-js');

module.exports = (app) => {

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
}