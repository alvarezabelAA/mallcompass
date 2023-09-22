const conn = require('../../config/database');
const bcrypt = require('bcrypt'); /*funcion hash*/
const cors = require('cors');
const { tokenSesion } = require('./functions')

module.exports = (app) => {


  /*const corsOptions = {
        origin: '*', // Reemplaza con el dominio del frontend
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type','Authorization'],
      };*/

  /*CONSULTA GENERAL DATOS USUARIOS*/
  app.options('/usuario/final/consulta', cors());
  app.get('/usuario/final/consulta', cors(),(req, res)=>{
    console.log("ejecucion metodo GET");
    let query = "SELECT * FROM usuarios";
    conn.query(query, (error, filas) => {
      if(error){
        res.json({ status: 0, mensaje: "error en DB", datos:error });
      }else{
        res.json({ status: 1, mensaje: "datos obtenidos", datos: filas });
      }
    });
  });


  /*CONSULTA DATOS USUARIO */
  app.options('/usuario/final/consulta', cors());
  app.get('/usuario/final/consulta', cors(),(req, res)=>{
    console.log("ejecucion metodo GET");
    let query = `SELECT * FROM usuarios INNER JOIN logintokens ON usuarios.correo=logintokens.correo WHERE id_usuario = ${req.query.tokenSesion}`;
    conn.query(query, (error, filas) => {
      if(error){
        res.json({ status: 0, mensaje: "error en DB", datos:error });
      }else{
        res.json({ status: 1, mensaje: "datos obtenidos", datos: filas });
      }
    });
  });



  /*LOGIN USUARIOS FINALES */
  app.options('/usuario/final/login', cors());
  app.get('/usuario/final/login', cors(),(req, res)=>{
    console.log("ejecucion metodo GET");

    let query = `SELECT contrasena FROM usuarios WHERE correo='${req.query.correo}'`;
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
              res.json({ status: 1, mensaje: "login exitoso", tokenSesionID: `${generador}` });
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
    let query1 = `SELECT token FROM logintokens WHERE '${req.query.tokenSesion}'`;
    var token;
    conn.query(query1, (error, filas) => {
      if(error){
        res.json({ status: 0, mensaje: "error en consulta de token", datos:error });
      }else{
        token = filas[0].token;
        console.log(`token encontrado -> ${token}`);
      }
    });

    let query2 = `DELETE FROM logintokens WHERE token='${req.query.tokenSesion}'`;
    conn.query(query2, (error, filas) => {
      if(error){
        res.json({ status: 0, mensaje: "error en DELETE sobre DB", datos:error });
      }else{
        if(token == req.query.tokenSesion){
          console.log("DELETE ejecutado");
          res.json({ status: 1, mensaje: "Logout exitoso", datos:[] });
        }else{
          console.log("DELETE no completado");
          res.json({ status: 1, mensaje: "logout fallido", datos:'token ingresado es incorrecto' });
        }
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

  /*UPDATE DE USUARIO NORMAL*/
  app.put('/usuario/final/update',(req,res)=>{
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
          let query = `UPDATE usuarios SET contrasena=?, apellido=?, nombre=?, rol=?, correo=?, telefono=?, imagen=?, fecha_nacimiento=? WHERE correo ='${correo}'`;
          const values = [req.body.contrasena, req.body.apellido, req.body.nombre, req.body.rol, req.body.correo, req.body.telefono, req.body.imagen, req.body.fecha_nacimiento];
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

}
