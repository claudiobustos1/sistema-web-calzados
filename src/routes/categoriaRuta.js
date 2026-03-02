const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const categoriaController= require("../controllers/categoriaController");
const admin = require("../middlewares/admin");

//ruta para ver categorias con paginacion y buscador
router.get("/categorias", admin, categoriaController.categoria);

//ruta para crear una nueva categoria
router.get("/categorias/crear", admin, categoriaController.mostrarCrear);
router.post("/categorias/crear", admin, [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
], categoriaController.crear);

//ruta para editar una categoria
router.get("/categorias/editar/:id", admin, categoriaController.mostrarEditar);
router.post("/categorias/editar/:id", admin, [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
], categoriaController.editarCategoria);

//ruta para eliminar una categoria
router.get("/categorias/eliminar/:id_categoria", admin, categoriaController.eliminarCategoria);

module.exports = router;