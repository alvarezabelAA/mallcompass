const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/

module.exports = (app) => {
    /*CONSULTA DATOS USUARIO*/
    app.get('/usuario/final',(req, res)=>{
        console.log("ejecucion metodo GET");
        let query = "SELECT * FROM usuario_final";
        conn.query(query, (error, filas) => {
            if(error){
                res.json({status: 0, mensaje: "error en DB", datos:error});
            }else{
                res.json({status: 1, mensaje: "datos obtenidos", datos: filas});
            }
        });
    });

    /* REGISTRO DATOS USUARIO*/
    app.post('/usuario/final',(req,res)=>{
        console.log("ejecucion metodo POST");
        if(!req.body.contrasena || !req.body.apellido || !req.body.nombre || !req.body.correo || !req.body.telefono || !req.body.imagen || !req.body.fecha_nacimiento){
            res.json({status: 0, mensaje: "error datos enviados", descripcion:"algun campo enviado se encuentra vacio"});
            return;
        }

        const contraseña = `${req.body.contrasena}${req.body.nombre}`;
        bcrypt.hash(contraseña, 10, (err, hash) => {
            if (err) {
              console.error('Error al hashear la contraseña:', err);
              return;
            }
            // El hash de la contraseña está en la variable 'hash'
            console.log('Contraseña hasheada:', hash);

            let query = `INSERT INTO usuario_final(contrasena, apellido, nombre, correo, telefono, imagen, fecha_nacimiento) VALUES ('${hash}','${req.body.apellido}','${req.body.nombre}','${req.body.correo}','${req.body.telefono}','${req.body.imagen}','${req.body.fecha_nacimiento}')`;
            conn.query(query, (error, filas)=>{
                if(error){
                    res.json({status: 0, mensaje: "error en DB", datos:error});
                }else{
                    res.json({status: 1, mensaje: "datos insertados en DB", datos: []});
                }
            });
        });

    });

    app.put('/usuario/final',(req,res)=>{
        console.log("ejecucion metodo PUT");
        res.json({mensaje:"respuesta desde PUT"});
    });

    app.delete('/usuario/final',(req,res)=>{
        console.log("ejecucion metodo DELETE");
        res.json({mensaje:"respuesta desde DELETE"});
    });
}