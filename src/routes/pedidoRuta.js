const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Ver los pedidos del cliente en sesion
router.get('/pedidos', pedidoController.obtenerMisPedidos);

module.exports = router;
