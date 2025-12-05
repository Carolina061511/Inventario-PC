const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const multer = require('./multer'); // tu configuración de multer
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

let articulos = [
  { _id: 1, codigo: 'A001', nombre: 'Teclado', precio: 25, cantidad: 10, foto: 'teclado.jpg', descripcion: 'Teclado mecánico' },
  { _id: 2, codigo: 'A002', nombre: 'Mouse', precio: 15, cantidad: 15, foto: 'mouse.jpg', descripcion: 'Mouse óptico' }
];

// Inicio
app.get('/', (req, res) => {
  res.render('index', { title: 'Listado de artículos', articulos });
});

// Formulario nuevo artículo
app.get('/articulos/new', (req, res) => {
  res.render('form', { 
    title: 'Agregar artículo',
    accion: 'Agregar',
    action: '/articulos',
    articulo: null
  });
});

// Agregar artículo
app.post('/articulos', multer.single('foto'), (req, res) => {
  const { codigo, nombre, precio, cantidad, descripcion } = req.body;
  const foto = req.file ? req.file.filename : null;
  articulos.push({
    _id: Date.now(),
    codigo, nombre, precio, cantidad, descripcion, foto
  });
  res.redirect('/');
});

// Editar artículo
app.get('/articulos/:id/edit', (req, res) => {
  const articulo = articulos.find(a => a._id == req.params.id);
  res.render('form', { 
    title: 'Editar artículo',
    accion: 'Editar',
    action: `/articulos/${articulo._id}?_method=PUT`,
    articulo 
  });
});

// Guardar edición
app.post('/articulos/:id', multer.single('foto'), (req, res) => {
  const articulo = articulos.find(a => a._id == req.params.id);
  const { codigo, nombre, precio, cantidad, descripcion } = req.body;
  articulo.codigo = codigo;
  articulo.nombre = nombre;
  articulo.precio = precio;
  articulo.cantidad = cantidad;
  articulo.descripcion = descripcion;
  if(req.file) articulo.foto = req.file.filename;
  res.redirect('/');
});

app.listen(3000, ()=>console.log('Servidor en http://localhost:3000'));
