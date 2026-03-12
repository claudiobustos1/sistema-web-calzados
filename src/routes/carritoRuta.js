const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

// Ver página completa del carrito
router.get('/', carritoController.verCarrito);

// Obtener carrito como JSON
router.get('/api', carritoController.obtenerCarritoUsuario);

// Obtener carrito como HTML para mostrar en modal
router.get('/api/carrito', carritoController.mostrarCarroModal);

// Obtener datos del cliente
router.get('/checkout/datos-cliente', carritoController.obtenerDatosCliente);

// Guardar datos del cliente
router.post('/checkout/guardar-datos', carritoController.guardarDatosCliente);

// Procesar pedido
router.post('/checkout/procesar', carritoController.procesarPedido);

// Agregar producto al carrito
router.post('/agregar', carritoController.agregarAlCarrito);

// Actualizar cantidad del item
router.post('/actualizar-cantidad', carritoController.actualizarCantidad);

// Eliminar producto del carrito
router.delete('/eliminar/:id_item', carritoController.eliminarDelCarrito);

module.exports = router;
