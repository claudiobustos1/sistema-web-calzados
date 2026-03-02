const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
router.get("/logout", usuarioController.logout);

module.exports = router;