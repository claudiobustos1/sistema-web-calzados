
const autenticar = (req, res, next) => {
    try{
        if (req.session && req.session.user && req.session.user.rol === 'cliente') { // Verifica si la sesión y el usuario existen
            return next();
        } else {
            return res.redirect('/inicioSesion');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }

};
module.exports = autenticar;