const Articulo = require('../models/Articulo');
const path = require('path');
const fs = require('fs');

module.exports = {
  listar: async (req, res) => {
    const articulos = await Articulo.find().sort({ createdAt: -1 });
    res.render('index', { articulos });
  },

  formularioNuevo: (req, res) => {
    res.render("layout", { content: "new" });
  },

  crear: async (req, res) => {
    try {
      const { code, name, description, quantity, price } = req.body;
      const photo = req.file ? `/public/uploads/${req.file.filename}` : null;
      await Articulo.create({ code, name, description, quantity: Number(quantity||0), price: Number(price), photo });
      res.redirect('/articulos');
    } catch (e) {
      console.error(e);
      res.send('Error al crear artículo: ' + e.message);
    }
  },

  mostrar: async (req, res) => {
    const articulo = await Articulo.findById(req.params.id);
    if(!articulo) return res.redirect('/articulos');
    res.render('show', { articulo });
  },

  formularioEditar: async (req, res) => {
    const articulo = await Articulo.findById(req.params.id);
    if(!articulo) return res.redirect('/articulos');
    res.render('edit', { articulo });
  },

  actualizar: async (req, res) => {
    try {
      const { code, name, description, quantity, price } = req.body;
      const articulo = await Articulo.findById(req.params.id);
      if(!articulo) return res.redirect('/articulos');

      if(req.file) {
        if(articulo.photo) {
          const oldPath = path.join(__dirname, '..', articulo.photo.replace('/public','public'));
          fs.unlink(oldPath, err => {/* no interrumpir si falla */});
        }
        articulo.photo = `/public/uploads/${req.file.filename}`;
      }

      articulo.code = code;
      articulo.name = name;
      articulo.description = description;
      articulo.quantity = Number(quantity||0);
      articulo.price = Number(price);

      await articulo.save();
      res.redirect(`/articulos/${articulo._id}`);
    } catch (e) {
      console.error(e);
      res.send('Error al actualizar: ' + e.message);
    }
  },

  eliminar: async (req, res) => {
    try {
      const articulo = await Articulo.findById(req.params.id);
      if(articulo) {
        if(articulo.photo) {
          const photoPath = path.join(__dirname, '..', articulo.photo.replace('/public','public'));
          fs.unlink(photoPath, err => {/* ignore errors */});
        }
        await Articulo.findByIdAndDelete(req.params.id);
      }
      res.redirect('/articulos');
    } catch (e) {
      console.error(e);
      res.redirect('/articulos');
    }
  }
};
