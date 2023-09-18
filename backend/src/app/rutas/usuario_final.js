const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/

module.exports = (app) => {
    /*CONSULTA GENERAL DATOS USUARIOS*/
    app.get('/usuario/final/consulta',(req, res)=>{
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


    /*CONSULTA DATOS USUARIO */
    app.get('/usuario/final/consulta/:id_usuarioFinal',(req, res)=>{
        console.log("ejecucion metodo GET");
        let query = `SELECT * FROM usuario_final WHERE id_usuarioFinal = ${req.params.id_usuarioFinal}`;
        conn.query(query, (error, filas) => {
            if(error){
                res.json({status: 0, mensaje: "error en DB", datos:error});
            }else{
                res.json({status: 1, mensaje: "datos obtenidos", datos: filas});
            }
        });
    });


    /*LOGIN USUARIOS FINALES */
    app.get('/usuario/final/login/:correo/:contrasena',(req, res)=>{
        console.log("ejecucion metodo GET");


        let query = `SELECT contrasena FROM usuario_final WHERE correo='${req.params.correo}'`;
        conn.query(query, (error, filas) => {
            if(error){
                res.json({status: 0, mensaje: "error en DB", datos:error});
            }else{
                console.log("datos obtenidos de DB");
                

                bcrypt.compare(req.params.contrasena, filas[0].contrasena, (err, result) => {
                    if (err) {
                      console.error('Error al comparar contraseñas:', err);
                      return;
                    }
                  
                    if (result) {
                      console.log('Contraseña válida');
                      res.json({status: 1, mensaje: "login exitoso", datos: []});
                    } else {
                      console.log('Contraseña inválida');
                      console.log(`Contraseña obtenida: ${filas[0].contrasena}`);
                      res.json({status: 1, mensaje: "contraseña incorrecta", datos: []});
                    }
                  });
            }
        });
        

    });


    /* REGISTRO DATOS USUARIO*/
    app.post('/usuario/final/registro',(req,res)=>{
        console.log("ejecucion metodo POST");
        if(!req.body.contrasena || !req.body.apellido || !req.body.nombre || !req.body.correo || !req.body.telefono || !req.body.imagen || !req.body.fecha_nacimiento){
            res.json({status: 0, mensaje: "error datos enviados", descripcion:"algun campo enviado se encuentra vacio"});
            return;
        }

        bcrypt.hash(req.body.contrasena, 10, (err, hash) => {
            if (err) {
              console.error('Error al hashear la contraseña:', err);
              return;
            }
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