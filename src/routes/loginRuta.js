const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const { body } = require("express-validator");

router.get("/", loginController.login); // Muestra el formulario de login
router.post("/", loginController.procesarLogin); // Procesa el formulario de login
router.get("/registro_usuario", loginController.registro);//formulario de registro
router.post("/registro_usuario",[
    // Validaciones
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
    body("email").isEmail().withMessage("Debe ingresar un email válido"),
    body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
    body("password1").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden");
        }
        return true;
    }),
], loginController.procesarRegistro);



module.exports = router;