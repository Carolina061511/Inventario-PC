const express = require('express');
const router = express.Router();
const ArticulosCtrl = require('../controllers/articulos.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegúrate que carpeta public/uploads existe
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rutas CRUD
router.get('/', ArticulosCtrl.listar);
router.get('/new', ArticulosCtrl.formularioNuevo);
router.post('/', upload.single('photo'), ArticulosCtrl.crear);
router.get('/:id', ArticulosCtrl.mostrar);
router.get('/:id/edit', ArticulosCtrl.formularioEditar);
router.put('/:id', upload.single('photo'), ArticulosCtrl.actualizar);
router.delete('/:id', ArticulosCtrl.eliminar);

module.exports = router;
