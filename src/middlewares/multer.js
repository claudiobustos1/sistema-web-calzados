const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // La ruta es relativa al directorio base del proyecto (o donde se inicia el servidor)
    cb(null, path.join(__dirname, '../public/uploads')); 
  },
  filename: (req, file, cb) => {
    // Usar un nombre único para evitar sobreescribir
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// validacion de imagen 
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos .jpg y .png'), false);
    }
  }
});

module.exports = upload;