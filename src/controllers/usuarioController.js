const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const Cliente = require('../models/cliente');

const usuarioController = {
    // Ver el perfil del usuario
    verPerfil: async (req, res) => {
        try {
            if (!req.session.user) {
                req.flash('varEstiloMensaje', 'warning');
                req.flash('varMensaje', 'Debes iniciar sesión para acceder a tu perfil.');
                return res.redirect('/inicioSesion');
            }

            // Buscar usuario y sus datos de cliente
            const usuario = await Usuario.findByPk(req.session.user.id);
            const cliente = await Cliente.findOne({ where: { id_usuario: req.session.user.id } });

            res.render('perfil', {
                title: 'Mi Perfil',
                userConfig: usuario.get({ plain: true }),
                cliente: cliente ? cliente.get({ plain: true }) : null,
                active: { perfil: true }
            });
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            res.status(500).render('error', { mensaje: 'Ocurrió un error al cargar el perfil.' });
        }
    },

    // Actualizar datos de envío
    actualizarPerfil: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/inicioSesion');
            }

            const { ciudad, direccion, telefono } = req.body;

            let cliente = await Cliente.findOne({ where: { id_usuario: req.session.user.id } });

            if (cliente) {
                cliente.ciudad = ciudad;
                cliente.direccion = direccion;
                cliente.telefono = telefono;
                await cliente.save();
            } else {
                cliente = await Cliente.create({
                    id_usuario: req.session.user.id,
                    ciudad,
                    direccion,
                    telefono
                });
            }

            req.flash('varEstiloMensaje', 'success');
            req.flash('varMensaje', 'Tus datos de envío se han actualizado exitosamente.');
            res.redirect('/perfil');
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            req.flash('varEstiloMensaje', 'danger');
            req.flash('varMensaje', 'Error al actualizar los datos.');
            res.redirect('/perfil');
        }
    },

    // Cambiar contraseña
    cambiarPassword: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/inicioSesion');
            }

            const { passwordActual, passwordNuevo, passwordConfirmar } = req.body;

            // Validar que las contraseñas nuevas coinciden
            if (passwordNuevo !== passwordConfirmar) {
                req.flash('varEstiloMensaje', 'danger');
                req.flash('varMensaje', 'Las nuevas contraseñas no coinciden.');
                return res.redirect('/perfil');
            }

            // Validar longitud
            if (passwordNuevo.length < 6) {
                req.flash('varEstiloMensaje', 'danger');
                req.flash('varMensaje', 'La nueva contraseña debe tener al menos 6 caracteres.');
                return res.redirect('/perfil');
            }

            // Buscar el usuario real en DB para obtener el hash actual
            const usuario = await Usuario.findByPk(req.session.user.id);

            // Verificar la contraseña actual
            const isMatch = await bcrypt.compare(passwordActual, usuario.password);
            if (!isMatch) {
                req.flash('varEstiloMensaje', 'danger');
                req.flash('varMensaje', 'La contraseña actual es incorrecta.');
                return res.redirect('/perfil');
            }

            // Generar nuevo hash y guardar
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(passwordNuevo, salt);
            await usuario.save();

            req.flash('varEstiloMensaje', 'success');
            req.flash('varMensaje', 'Contraseña actualizada exitosamente. Usa tu nueva contraseña la próxima vez.');
            res.redirect('/perfil');
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            req.flash('varEstiloMensaje', 'danger');
            req.flash('varMensaje', 'Error al cambiar la contraseña.');
            res.redirect('/perfil');
        }
    },

    // Logout original
    logout: (req, res) => {
        const userName = req.session.user ? req.session.user.nombre : '';
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).send('Error al cerrar sesión');
            }
            res.redirect("/");
        });
    }
}
module.exports = usuarioController;