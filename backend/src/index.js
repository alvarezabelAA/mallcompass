const app = require('./config/server');
require('./app/rutas/usuario_final')(app);

app.listen(app.get('puerto'), () => console.log(`Servidor Corriendo en puerto ${app.get('puerto')}`));

/*app.use((req,res)=>{
    res.status(404).json({status: 1, mensaje: "ruta o endpoint erroneo", datos: []})
})*/

/*ruta local de prueba http://localhost:4044 */
/*ejemplo de ruta con ngrok https://405c-186-151-141-111.ngrok.io/usuario/final */