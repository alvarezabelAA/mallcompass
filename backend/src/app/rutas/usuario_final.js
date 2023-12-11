const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { tokenSesion,insertUsuarios,deleteUsuarios } = require('./functions');
const { x64 } = require('crypto-js');

module.exports = (app) => {


  /*const corsOptions = {
        origin: '*', // Reemplaza con el dominio del frontend
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type','Authorization'],
      };*/

  /*CONSULTA GENERAL DATOS USUARIOS*/
  app.options('/usuario/final/consulta', cors());
  app.get('/usuario/final/consulta', cors(),(req, res)=>{
    let query = `SELECT * FROM logintokens WHERE token = '${req.query.token}'`;
    conn.query(query, (error, filas) => {
      if(error){
        console.log("No se encontró el token");
      }else{
        if(filas.length == 0){
          console.log("consulta sin elementos");
          res.json({ status: 0, mensaje: "error de token", datos: filas });
        }else{
          console.log("encontro el token");

          console.log("ejecucion metodo GET");
          let query = "SELECT * FROM usuarios";
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


  /*CONSULTA DATOS de un USUARIO */
  app.options('/usuario/final/consultaGeneral', cors());
  app.get('/usuario/final/consultaGeneral', cors(),(req, res)=>{
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
          let query = `SELECT * FROM usuarios INNER JOIN logintokens ON usuarios.correo=logintokens.correo WHERE token = '${req.query.tokenSesion}'`;
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


  /*LOGIN USUARIOS FINALES */
  app.options('/usuario/final/login', cors());
  app.get('/usuario/final/login', cors(),(req, res)=>{
    console.log("ejecucion metodo GET");
    let query = `SELECT contrasena,rol,id_usuario FROM usuarios WHERE correo='${req.query.correo}'`;
    conn.query(query, (error, filas) => {
      if(error){
        res.json({ status: 0, mensaje: "error en DB", datos:error });
      }else{
        console.log("datos obtenidos de DB");

        if(filas.length == 0){
          res.json({ status: 0, mensaje: "login fallido", datos: [] });
        }else{

          bcrypt.compare(req.query.contrasena, filas[0].contrasena, (err, result) => {
            if (err) {
              console.error('Error al comparar contraseñas:', err);
              return;
            }
                      
            if (result) {
              console.log('Contraseña válida');
              const generador = tokenSesion(req.query.correo, req.query.contrasena);

            
              /*VERIFICACION SI USUARIO TIENE TIENDA*/
              let query2 = `SELECT * FROM usuarios INNER JOIN rel_user_tienda ON usuarios.id_usuario=rel_user_tienda.id_usuario WHERE correo='${req.query.correo}'`;
              conn.query(query2, (error2, filas2) => {
                if(error2){
                  res.json({ status: 0, mensaje: "error en DB", datos:error2 });
                }else{
                  if(filas2.length == 0){
                    console.log("consulta sin elementos");
                    /*VERIFICACION SI USUARIO TIENE CC*/
                    let query3 = `SELECT * FROM usuarios INNER JOIN rel_user_cc ON usuarios.id_usuario=rel_user_cc.id_usuario WHERE correo='${req.query.correo}'`;
                    conn.query(query3, (error3, filas3) => {
                      if(error3){
                        res.json({ status: 0, mensaje: "error en DB", datos:error3 });
                      }else{
                        if(filas3.length == 0){
                          console.log("Usuario normal iniciando sesion...");
                          res.json({ status: 1, mensaje: "login exitoso", tokenSesionID: `${generador}`, rol:`${filas[0].rol}`, id_usuario:`${filas[0].id_usuario}`, id_tienda:``, id_centroComercial:`` });
                        }else{
                          console.log("datos obtenidos de DB ADMIN CC");
                          res.json({ status: 1, mensaje: "login exitoso", tokenSesionID: `${generador}`, rol:`${filas[0].rol}`, id_usuario:`${filas[0].id_usuario}`, id_tienda:``, id_centroComercial:`${filas3[0].id_centroComercial}` });
                        }
                      }
                    });
                  }else{
                    console.log("datos obtenidos de DB ADMIN TIENDA");
                    let query4 = `SELECT * FROM rel_cc_tiendas WHERE id_tienda='${filas2[0].id_tienda}'`;
                    conn.query(query4, (error4, filas4) => {
                      if(error4){
                        res.json({ status: 0, mensaje: "error en DB", datos:error4 });
                      }else{
                        console.log("datos obtenidos de DB 2");
                        res.json({ status: 1, mensaje: "login exitoso", tokenSesionID: `${generador}`, rol:`${filas[0].rol}`, id_usuario:`${filas[0].id_usuario}`, id_tienda:`${filas2[0].id_tienda}`, id_centroComercial:`${filas4[0].id_centroComercial}` });
                      }
                    });
                  }
                }
              });



            } else {
              console.log('Contraseña inválida');
              console.log(`Contraseña obtenida: ${filas[0].contrasena}`);
              res.json({ status: 1, mensaje: "contraseña incorrecta", datos: [] });
            }
          });
        }
      }
    });
  });

  /* LOGOUT DE USUARIO*/
  app.options('/usuario/final/logout', cors());
  app.delete('/usuario/final/logout', cors(),(req, res)=>{
    let query1 = `SELECT token FROM logintokens WHERE '${req.body.tokenSesion}'`;
    console.log(`token de frontend -> ${req.body.tokenSesion}`);
    conn.query(query1, (error, filas1) => {
      if(error){
        res.json({ status: 0, mensaje: "error en consulta de token", datos:error });
      }else{
        console.log(`token encontrado -> ${filas1[0].token}`);
      
        let query2 = `DELETE FROM logintokens WHERE token='${req.body.tokenSesion}'`;
        conn.query(query2, (error, filas) => {
          if(error){
            res.json({ status: 0, mensaje: "error en DELETE sobre DB", datos:error });
          }else{
            if(filas1[0].token == req.body.tokenSesion){
              console.log("DELETE ejecutado");
              res.json({ status: 1, mensaje: "Logout exitoso", datos:[] });
            }else{
              console.log("DELETE no completado");
              res.json({ status: 0, mensaje: "logout fallido", datos:'token ingresado es incorrecto' });
            }
          }
        });
      }
    });
  });



  /* REGISTRO DATOS USUARIO*/
  app.options('/usuario/final/registro', cors());
  app.post('/usuario/final/registro', cors(),(req, res) => {
    console.log("ejecucion metodo POST");
    if (!req.body.contrasena || !req.body.apellido || !req.body.nombre || !req.body.correo || !req.body.telefono || !req.body.imagen || !req.body.fecha_nacimiento) {
      res.json({ status: 0, mensaje: "error datos enviados", descripcion: "algun campo enviado se encuentra vacío" });
      return;
    }
    
    bcrypt.hash(req.body.contrasena, 10, (err, hash) => {
      if (err) {
        console.error('Error al hashear la contraseña:', err);
        return;
      }
      console.log('Contraseña hasheada:', hash);
        
      const rol = "U";
      let query = `INSERT INTO usuarios(contrasena, apellido, nombre, rol, correo, telefono, imagen, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [hash, req.body.apellido, req.body.nombre, rol, req.body.correo, req.body.telefono, req.body.imagen, req.body.fecha_nacimiento];
        
      conn.query(query, values, (error, filas) => {
        if (error) {
          res.json({ status: 0, mensaje: "error en DB", datos: error });
        } else {
          res.json({ status: 1, mensaje: "datos insertados en DB", datos: [] });
        }
      });
    });
  });



  /*UPDATE DE USUARIO NORMAL SUPERADMIN*/
  app.options('/usuario/final/update', cors());
  app.put('/usuario/final/update', cors(), (req, res) => {
    console.log("ejecucion metodo GET");
    let query = `SELECT * FROM logintokens WHERE token = '${req.query.token}'`;
    conn.query(query, (error, filas) => {
      if(error){
        console.log("No se encontró el token");
      }else{
        if(filas.length == 0){
          console.log("consulta sin elementos");
          res.json({ status: 0, mensaje: "error de token", datos: filas });
        }else{
          console.log("encontro el token");

          const { contrasena, apellido, nombre, rol, correo, telefono, imagen, fecha_nacimiento, id_usuario } = req.body;
            
          if (!correo) {
            res.json({ status: 0, mensaje: 'Correo no proporcionado en el cuerpo de la solicitud' });
            return;
          }
          
          if((req.query.idComercial == null && req.query.idTienda == null && (rol == "S" || rol == "U")) || (req.query.idComercial == "" && req.query.idTienda == "")){
            // Construye la consulta de actualización
            console.log(`req.query.idComercial -> ${req.query.idComercial}`);
            console.log(`req.query.idTienda -> ${req.query.idTienda}`);
            const query = `UPDATE usuarios SET contrasena = ?, apellido = ?, nombre = ?, rol = ?, telefono = ?, imagen = ?, fecha_nacimiento = ? WHERE correo = ?`;
            const values = [contrasena, apellido, nombre, rol, telefono, imagen, fecha_nacimiento, correo];
            // Ejecuta la consulta de actualización
            conn.query(query, values, (error, filas) => {
              if (error) {
                res.json({ status: 0, mensaje: 'Error al actualizar el usuario', datos: error });
              } else {
                res.json({ status: 1, mensaje: 'Actualización de usuario realizada', datos: filas });
              }
            });
          }else{
          
            if(rol == "C" && req.query.idComercial != null){
              // Construye la consulta de actualización
              const query = `UPDATE usuarios SET contrasena = ?, apellido = ?, nombre = ?, rol = ?, telefono = ?, imagen = ?, fecha_nacimiento = ? WHERE correo = ?`;
              const values = [contrasena, apellido, nombre, rol, telefono, imagen, fecha_nacimiento, correo];
              // Ejecuta la consulta de actualización
              conn.query(query, values, (error, filas) => {
                if (error) {
                  res.json({ status: 0, mensaje: 'Error al actualizar el usuario', datos: error });
                } else {
                  res.json({ status: 1, mensaje: 'Actualización de usuario realizada', datos: filas });
                }
              });
            
              /*INSERT EN TABLA RELACION */
              console.log("se ejecuto C");
              insertUsuarios(id_usuario,rol, req.query.idComercial);
            }else{
              console.log("usuario C no insertado");
          
          
              if(rol == "T" && req.query.idTienda != null){
                // Construye la consulta de actualización
                const query = `UPDATE usuarios SET contrasena = ?, apellido = ?, nombre = ?, rol = ?, telefono = ?, imagen = ?, fecha_nacimiento = ? WHERE correo = ?`;
                const values = [contrasena, apellido, nombre, rol, telefono, imagen, fecha_nacimiento, correo];
                // Ejecuta la consulta de actualización
                conn.query(query, values, (error, filas) => {
                  if (error) {
                    res.json({ status: 0, mensaje: 'Error al actualizar el usuario', datos: error });
                  } else {
                    res.json({ status: 1, mensaje: 'Actualización de usuario realizada', datos: filas });
                  }
                });
              
                /*INSERT EN TABLA RELACION */
                console.log("se ejecuto T");
                insertUsuarios(id_usuario,rol, req.query.idTienda);
              }else{
                console.log("usuario T no insertado");
                res.json({ status: 0, mensaje: 'No se puede actualizar', datos: "parametros faltantes o erroneos" });
              }
            }
          }

        }
      }
    });

  });
  

  /*UPDATE DE DATOS DE UN USUARIO NORMAL*/
  app.options('/usuario/final/updateGeneral', cors());
  app.put('/usuario/final/updateGeneral',(req,res)=>{
    let query1 = `SELECT * FROM logintokens WHERE token ='${req.query.tokenSesion}'`;
    var correo;
    var token;
    conn.query(query1, (error, filas) => {
      if(error){
        res.json({ status: 0, mensaje: "error en consulta de correo", datos:error });
      }else{
        if(filas.length == 0){
          res.json({ status: 0, mensaje: "error token no valido", datos:error });
        }else{
          correo = filas[0].correo;
          token = filas[0].token;
          console.log(`correo encontrado -> ${correo}  || token encontrado -> ${token}`);
          let query = `UPDATE usuarios SET contrasena=?, apellido=?, nombre=?, correo=?, telefono=?, imagen=?, fecha_nacimiento=? WHERE correo ='${correo}'`;
          const values = [req.body.contrasena, req.body.apellido, req.body.nombre, req.body.correo, req.body.telefono, req.body.imagen, req.body.fecha_nacimiento];
          conn.query(query, values, (error, filas) => {
            if(error){
              res.json({ status: 0, mensaje: "error en DB", datos:error });
            }else{
                            
              res.json({ status: 1, mensaje: "Update de usuario realizado", datos: filas });
                            
            }
          });
        }
      }
    });


  });

  /* DELETE DE USUARIO POR ID_USUARIO*/
  app.options('/usuario/final/delete', cors());
  app.delete('/usuario/final/delete', cors(), (req, res) => {
    let query = `SELECT * FROM logintokens WHERE token = '${req.query.token}'`;
    conn.query(query, (error, filas) => {
      if(error){
        console.log("No se encontró el token");
      }else{
        if(filas.length == 0){
          console.log("consulta sin elementos");
          res.json({ status: 0, mensaje: "error de token", datos: filas });
        }else{
          console.log("encontro el token");

          var  id_usuario  = req.query.id_usuario; // Obtiene el id_usuario del cuerpo de la solicitud
          if (!id_usuario) {
            res.json({ status: 0, mensaje: 'Falta el parámetro id_usuario en el cuerpo de la solicitud' });
            return;
          }

          /*DELETE DE LOGINTOKEN y RELACIONES
          deleteUsuarios(id_usuario);*/


          /*DELETE DE TABLA USUARIO */
          const query = `DELETE FROM usuarios WHERE id_usuario = ?`;
          conn.query(query, [id_usuario], (error, result) => {
            if (error) {
              res.json({ status: 0, mensaje: 'Error al eliminar el usuario', datos: error });
            } else {
              if (result.affectedRows > 0) {
                res.json({ status: 1, mensaje: 'Usuario eliminado correctamente', datos: result });
              } else {
                res.json({ status: 0, mensaje: 'No se encontró ningún usuario con ese id_usuario' });
              }
            }
          });
        }
      }
    });
  });


  /* 
PENDIENTES:
-logout: temporizador de inactividad para que haga un logout automaticamente
-delete de usuario: elimine de las demas tablas en la DB
*/


}


