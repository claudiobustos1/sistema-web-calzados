const Pedido = require('../models/pedido');
const PedidoItem = require('../models/pedidoItem');
const Inventario = require('../models/inventario');
const Producto = require('../models/producto');
const Cliente = require('../models/cliente');

// Obtener los pedidos del usuario autenticado
exports.obtenerMisPedidos = async (req, res) => {
  try {
    // Verificar que el usuario está logueado
    if (!req.session.user) {
      req.flash('varEstiloMensaje', 'warning');
      req.flash('varMensaje', 'Debes iniciar sesión para ver tus pedidos.');
      return res.redirect('/inicioSesion');
    }

    // Buscar el cliente asociado al usuario actual
    const cliente = await Cliente.findOne({
      where: { id_usuario: req.session.user.id }
    });

    if (!cliente) {
      // El usuario no tiene perfil de cliente o no ha hecho pedidos aún
      return res.render('pedidos', {
        title: 'Mis Pedidos',
        pedidos: [],
        active: { pedidos: true }
      });
    }

    // Obtener todos los pedidos del cliente
    let pedidos = await Pedido.findAll({
      where: { id_cliente: cliente.id_cliente },
      order: [['fecha', 'DESC']],
      include: [{
        model: PedidoItem,
        as: 'items',
        include: [{
          model: Inventario,
          as: 'inventario',
          include: [{
            model: Producto,
            as: 'Producto'
          }]
        }]
      }]
    });
    
    // Serializar a formato plain para Handlebars (evitar errores de proto objects)
    pedidos = pedidos.map(p => p.get({ plain: true }));

    res.render('pedidos', {
      title: 'Mis Pedidos',
      pedidos: pedidos,
      active: { pedidos: true }
    });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).render('error', {
      title: 'Error',
      mensaje: 'Hubo un error al cargar tus pedidos. Por favor, intenta de nuevo más tarde.'
    });
  }
};
