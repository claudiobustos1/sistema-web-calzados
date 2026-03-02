const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productoController = require('../controllers/productosController');
const admin = require('../middlewares/admin');
const upload = require('../middlewares/multer');

router.get("/productos", admin, productoController.productos);
router.get("/productos/registrar", admin, productoController.mostrarRegistrar);
router.post("/productos/registrar", admin, upload.single('imagen'),[
    body("nombre").notEmpty().withMessage("El nombre del producto es obligatorio"),
    body("precio").isFloat({ gt: 0 }).withMessage("El precio debe ser un número mayor que cero")
  ],
  productoController.registrarProducto
);

router.get("/productos/editar/:id", admin, productoController.mostrarEditar);
router.post("/productos/editar/:id", admin, upload.single('imagen'),
  [
    body("nombre").notEmpty().withMessage("El nombre del producto es obligatorio"),
    body("precio").isFloat({ gt: 0 }).withMessage("El precio debe ser un número mayor que cero")
  ],
  productoController.editarProducto
);

router.get("/productos/eliminar/:id", admin, productoController.eliminarProducto);

module.exports = router;