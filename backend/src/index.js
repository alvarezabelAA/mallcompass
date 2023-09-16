const app = require('./config/server');

app.listen(app.get('puerto'), () => console.log(`Servidor Corriendo en puerto ${app.get('puerto')}`));