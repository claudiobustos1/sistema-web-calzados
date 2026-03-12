const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
router.get("/logout", usuarioController.logout);

// Rutas de Perfil de Usuario
router.get("/perfil", usuarioController.verPerfil);
router.post("/perfil/actualizar", usuarioController.actualizarPerfil);
router.post("/perfil/cambiar-password", usuarioController.cambiarPassword);

module.exports = router;