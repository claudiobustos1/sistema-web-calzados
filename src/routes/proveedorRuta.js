const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const proveedorController = require("../controllers/proveedorController");
const admin = require("../middlewares/admin");

router.get("/proveedores", admin, proveedorController.proveedor);
router.get("/proveedores/crear", admin, proveedorController.formproveedor);

router.post("/proveedores/crear", admin, [
  body("empresa").notEmpty().withMessage("El nombre de la empresa es obligatorio"),
  body("contacto").notEmpty().withMessage("El nombre del contacto es obligatorio"),
  body("telefono").notEmpty().withMessage("El telefono es obligatorio"),
  body("email").isEmail().withMessage("Debe ingresar un email valido"),
], proveedorController.crear);

router.get("/proveedores/editar/:id", admin, proveedorController.mostrarEditar);
router.post("/proveedores/editar/:id", admin, [
  body("empresa").notEmpty().withMessage("El nombre de la empresa es obligatorio"),
  body("contacto").notEmpty().withMessage("El nombre del contacto es obligatorio"),
  body("telefono").notEmpty().withMessage("El telefono es obligatorio"),
  body("email").isEmail().withMessage("Debe ingresar un email valido"),
], proveedorController.editarProveedor);
router.get("/proveedores/eliminar/:id", admin, proveedorController.eliminarProveedor);

module.exports = router;