const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');

// Ruta para listar todos los productos del catálogo
router.get('/', catalogoController.listar);

// Ruta para búsqueda rápida
router.get('/buscar', catalogoController.buscar);

// Ruta para obtener detalle de un producto
router.get('/detalle/:id', catalogoController.detalle);

// Ruta para filtrar por categoría
router.get('/categoria/:id_categoria', catalogoController.porCategoria);

module.exports = router;
