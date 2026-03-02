
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

const loginController = {
    login: (req, res) => {
        // Si el usuario ya está logueado, redirigir al home
        if (req.session.user) {
            return res.redirect('/');
        }
        
        res.render('login', {
            title: 'Iniciar Sesión',
            varMensaje: null,
            varEstiloMensaje: null
        });
    },

    procesarLogin: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Validar campos
            if (!email || !password) {
                return res.render('login', {
                    title: 'Iniciar Sesión',
                    varMensaje: 'Todos los campos son obligatorios',
                    varEstiloMensaje: 'danger'
                });
            }

            // Buscar usuario por email
            const usuario = await Usuario.findOne({ 
                where: { email } 
            });

            if (!usuario) {
                return res.render('login', {
                    title: 'Iniciar Sesión',
                    varMensaje: 'email no valido o el usuario no esta registrado.',
                    varEstiloMensaje: 'danger'
                });
            }

            // Verificar contraseña
            const passwordValida = await bcrypt.compare(password, usuario.password);

            if (!passwordValida) {
                return res.render('login', {
                    title: 'Iniciar Sesión',
                    varMensaje: 'Contraseña incorecta',
                    varEstiloMensaje: 'danger'
                });
            }

            // Crear sesión
            req.session.user = {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            };

            // Redirigir según el rol
            if (usuario.rol === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/');
            }

        } catch (error) {
            console.error('Error en el login:', error);
            res.render('login', {
                title: 'Iniciar Sesión',
                varMensaje: 'no esta registrado.',
                varEstiloMensaje: 'danger'
            });
        }
    },
    registro: (req, res) => {
        // Si el usuario ya está logueado, redirigir al home
        if (req.session.user) {
            return res.redirect('/');
        }
        res.render('registro', {
            title: 'Registro de Usuario',
            varMensaje: null,
            varEstiloMensaje: null
        });
    },
    procesarRegistro: async (req, res) => {
        const { apellido, nombre, email, password, password1, rol } = req.body;
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            const mensajesError = errores.array().map(err => err.msg).join(' ');
            return res.render('registro', {
                title: 'Registro de Usuario',
                varMensaje: mensajesError,
                varEstiloMensaje: 'danger'
            });
        }
        if(await Usuario.findOne({ where: { email } })){
            return res.render('registro', {
                title: 'Registro de Usuario',
                varMensaje: 'El email ya está en uso',
                varEstiloMensaje: 'danger'
            });
        }
        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            await Usuario.create({
                apellido,
                nombre,
                email,
                password: hashedPassword,
                rol
            });
            res.redirect('/');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.render('registro', {
                title: 'Registro de Usuario',
                varMensaje: 'Error al registrar usuario',
                varEstiloMensaje: 'danger'
            });
        }
    }
}

module.exports = loginController;