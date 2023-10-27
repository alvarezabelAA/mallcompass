const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

// Configurar Multer para manejar la carga de archivos y almacenarlos en public/images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../../mallcompass/public/images'); // La carpeta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Manejar la solicitud POST para cargar el archivo
app.post('/upload', upload.single('imagen'), (req, res) => {
  // El archivo se ha subido y se encuentra en req.file
  // Realiza cualquier procesamiento adicional si es necesario
  res.json({ message: 'Archivo subido exitosamente' });
});

app.set('puerto', 4044);

module.exports = app;
