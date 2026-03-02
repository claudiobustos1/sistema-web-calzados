const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const inventarioController = require('../controllers/inventarioController');
const admin = require('../middlewares/admin');

router.get('/productos/:id/inventario', admin, inventarioController.listarPorProducto);
router.get('/productos/:id/inventario/registrar', admin, inventarioController.mostrarCrear);

router.post(
  '/productos/:id/inventario/registrar',
  admin,
  [
    body('talle').isInt({ min: 35, max: 45 }).withMessage('Talle debe ser un número entero entre 35 y 45'),
    body('stock').isInt({ min: 0 }).withMessage('Stock debe ser un entero mayor o igual a 0')
  ],
  inventarioController.crear
);

router.get('/productos/inventario/:id_inv/editar', admin, inventarioController.mostrarEditar);
router.post('/productos/inventario/:id_inv/editar', admin, inventarioController.editar);
router.post('/productos/inventario/:id_inv/eliminar', admin, inventarioController.eliminar);

module.exports = router;