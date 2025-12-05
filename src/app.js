const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const multer = require('./multer');
const methodOverride = require('method-override');

const app = express();

// ... (Middleware y Configuración, sin cambios) ...

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Datos de ejemplo (AÑADIMOS DESCRIPCIÓN A LOS DATOS DE EJEMPLO)
let articulos = [
  { _id: 1, codigo: 'A001', nombre: 'Teclado', descripcion: 'Teclado mecánico RGB', precio: 25, cantidad: 10, foto: 'teclado.jpg' },
  { _id: 2, codigo: 'A002', nombre: 'Mouse', descripcion: 'Mouse óptico ergonómico', precio: 15, cantidad: 15, foto: 'mouse.jpg' }
];

// 1. RUTAS PRINCIPALES (CORREGIDAS Y FUSIONADAS)
// La ruta '/' y '/articulos' hacen lo mismo: mostrar el listado.
// Esto soluciona el error del botón "Cancelar" y el enlace "Inicio" en el Header.
app.get(['/', '/articulos'], (req, res) => {
  res.render('index', { title: 'Listado de Artículos', articulos });
});

app.get('/articulos/new', (req, res) => {
  res.render('form', { title: 'Agregar artículo', accion: 'Agregar', action: '/articulos', articulo: null });
});

// 2. CORRECCIÓN DE app.post PARA GUARDAR DESCRIPCIÓN
app.post('/articulos', multer.single('foto'), (req, res) => {
  // *** CAMBIO CLAVE: AÑADIMOS 'descripcion' ***
  const { codigo, nombre, precio, cantidad, descripcion } = req.body; 
  const foto = req.file ? req.file.filename : null;
  
  articulos.push({ 
    _id: Date.now(), 
    codigo, 
    nombre, 
    descripcion, // <-- AHORA SE GUARDA
    precio, 
    cantidad, 
    foto 
  });
  res.redirect('/articulos'); // Redirigimos a la ruta corregida
});

app.get('/articulos/:id/edit', (req, res) => {
  const articulo = articulos.find(a => a._id == req.params.id);
  if (!articulo) return res.redirect('/articulos');
  res.render('form', { title: 'Editar artículo', accion: 'Editar', action: `/articulos/${articulo._id}?_method=PUT`, articulo });
});

// La ruta PUT ya incluía la descripción, por lo que está bien.
app.put('/articulos/:id', multer.single('foto'), (req, res) => {
  const articulo = articulos.find(a => a._id == req.params.id);
  if (!articulo) return res.redirect('/articulos');
  const { codigo, nombre, descripcion, precio, cantidad } = req.body;
  articulo.codigo = codigo;
  articulo.nombre = nombre;
  articulo.descripcion = descripcion;
  articulo.precio = precio;
  articulo.cantidad = cantidad;
  if (req.file) articulo.foto = req.file.filename;
  res.redirect('/articulos'); // Redirigimos a la ruta corregida
});

app.delete('/articulos/:id', (req, res) => {
  articulos = articulos.filter(a => a._id != req.params.id);
  res.redirect('/articulos'); // Redirigimos a la ruta corregida
});

// Servidor
app.listen(3000, () => console.log('Servidor en http://localhost:3000'));