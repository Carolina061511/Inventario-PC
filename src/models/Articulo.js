const mongoose = require('mongoose');

const articuloSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photo: { type: String }, // ruta relativa: /public/uploads/archivo.jpg
  description: { type: String },
  quantity: { type: Number, default: 0 },
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Articulo', articuloSchema);
