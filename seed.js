// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Articulo = require('./src/models/Articulo');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/inventario_pc';
mongoose.connect(mongoUri).then(async () => {
  await Articulo.deleteMany({});
  const items = [
    { code:'PC001', name:'Laptop Dell', photo:null, description:'Laptop de prueba', quantity:3, price:450.00 },
    { code:'PC002', name:'Teclado Mecánico', photo:null, description:'Teclado RGB', quantity:10, price:25.99 },
    { code:'PC003', name:'Mouse Óptico', photo:null, description:'Mouse con sensor', quantity:15, price:12.50 }
  ];
  await Articulo.insertMany(items);
  console.log('Seed completado');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
