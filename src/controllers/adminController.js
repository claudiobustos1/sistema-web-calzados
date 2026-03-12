const { logout } = require("./usuarioController");

const { Op } = require('sequelize');
const Usuario = require('../models/usuario');
const Pedido = require('../models/pedido');
const Producto = require('../models/producto');
const Cliente = require('../models/cliente');
const Inventario = require('../models/inventario');

const adminController = {
    dashboard: async (req, res) => {
        try {
            // 1. Ingresos Totales (Pedidos no cancelados)
            const ingresos = await Pedido.sum('total', {
                where: {
                    estado: {
                        [Op.ne]: 'cancelado'
                    }
                }
            }) || 0;

            // 2. Usuarios Registrados (solo clientes)
            const totalUsuarios = await Usuario.count({
                where: { rol: 'cliente' }
            });

            // 3. Pedidos Totales
            const totalPedidos = await Pedido.count();

            // 4. Actividad Reciente (Últimos 5 pedidos)
            let pedidosRecientes = await Pedido.findAll({
                limit: 5,
                order: [['fecha', 'DESC']],
                include: [{
                    model: Cliente,
                    as: 'cliente',
                    include: [{
                        model: Usuario,
                        as: 'relacion_cliente_usuario',
                        attributes: ['nombre', 'apellido', 'email']
                    }]
                }]
            });
            pedidosRecientes = pedidosRecientes.map(p => p.get({ plain: true }));

            // 5. Productos para "Productos Populares" (Por ahora los últimos 5 creados)
            let productosTabla = await Producto.findAll({
                limit: 5,
                order: [['id_producto', 'DESC']],
                include: [{
                    model: Inventario,
                    as: 'inventario'
                }]
            });
            productosTabla = productosTabla.map(p => {
                const prod = p.get({ plain: true });
                // Calcular inventario total de todos los talles de este producto
                prod.stockTotal = prod.inventario ? prod.inventario.reduce((sum, inv) => sum + inv.stock, 0) : 0;
                return prod;
            });

            res.render("dashboard", {
                title: "Panel de Administración",
                layout: "adminLayout",
                metricas: {
                    ingresos: parseFloat(ingresos).toFixed(2),
                    usuarios: totalUsuarios,
                    pedidos: totalPedidos
                },
                pedidosRecientes,
                productosTabla
            });
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            res.status(500).send("Error interno cargando el dashboard");
        }
    },
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
module.exports = adminController;