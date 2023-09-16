const conn = require('../../config/database');

module.exports = (app) => {
    app.get('/contacto',(req, res)=>{
        console.log("ejecucion metodo GET");
        res.json({mensaje:"respuesta desde GET"});
    });

    app.post('/contacto',(req,res)=>{
        console.log("ejecucion metodo POST");
        res.json({mensaje:"respuesta desde POST"});
    });

    app.put('/contacto',(req,res)=>{
        console.log("ejecucion metodo PUT");
        res.json({mensaje:"respuesta desde PUT"});
    });

    app.delete('/contacto',(req,res)=>{
        console.log("ejecucion metodo DELETE");
        res.json({mensaje:"respuesta desde DELETE"});
    });
}