const app = require('./config/server');
require('./app/rutas/prueba')(app);

app.listen(app.get('puerto'), () => console.log(`Servidor Corriendo en puerto ${app.get('puerto')}`));