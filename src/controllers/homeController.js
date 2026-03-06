
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Inventario = require('../models/inventario');
const sequelize = require('../database/conexionDB');

const homeController = {
    home: async (req, res) => {
        try {
            //algunos productos para recomendar 
            const recomendaciones = await Producto.findAll({
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Inventario, as: 'inventario' }
                ],
                limit: 8,
                order: sequelize.random() //random order
            });

            res.render('home', { recomendaciones });
        } catch (err) {
            console.error('Error en homeController:', err);
            res.render('home', { recomendaciones: [] });
        }
    }
};
module.exports = homeController;