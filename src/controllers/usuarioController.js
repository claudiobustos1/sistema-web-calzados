const usuarioController = {
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