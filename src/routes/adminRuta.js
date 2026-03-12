const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminPedidoController = require('../controllers/adminPedidoController');
const admin = require("../middlewares/admin");

router.get('/dashboard', admin, adminController.dashboard);
router.get('/logout', adminController.logout);

// Gestión de Pedidos Administrador
router.get('/pedidos', admin, adminPedidoController.listarPedidos);
router.post('/pedidos/:id_pedido/estado', admin, adminPedidoController.actualizarEstado);

module.exports = router;