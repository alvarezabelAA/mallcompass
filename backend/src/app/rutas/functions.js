const bcrypt = require('bcrypt'); /*funcion hash*/
const crypto = require('crypto');
const conn = require('../../config/database');

function tokenSesion(correo){
    let verificador = true;
    var token;
    while(verificador){
        
        token = crypto.randomBytes(64).toString('hex');
        console.log(`generando token -> ${token}`);
        let query1 = `SELECT token FROM logintokens WHERE token=?`;
        const values1 = [token];
        conn.query(query1, values1, (error, filas) => {
            if(error){
                res.json({status: 0, mensaje: "error consulta token erronea", datos:error});
                console.log('error en consulta de token')
            }else{
                if(filas[0].token == token){
                    verificador = true;
                }else{
                    let query = `INSERT INTO logintokens (token, correo) VALUES (?,?)`;
                    const values = [token, correo];
                    conn.query(query, values, (error, filas) => {
                        if(error){
                            res.json({status: 0, mensaje: "error en DB", datos:error});
                        }else{
                            res.json({ status: 1, mensaje: "datos insertados en DB", datos: [] });
                            console.log(`token de sesion generado: ${token} -> ${correo}`);
                        }
                    });

                    verificador = false
                }
            }
        });

    }

    return token;
}

function hasheador(contrasena){
}

module.exports = {
    hasheador,
    tokenSesion
}