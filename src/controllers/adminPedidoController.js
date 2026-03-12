const Pedido = require('../models/pedido');
const PedidoItem = require('../models/pedidoItem');
const Cliente = require('../models/cliente');
const Usuario = require('../models/usuario');
const Inventario = require('../models/inventario');
const Producto = require('../models/producto');

const adminPedidoController = {
  // Mostrar la lista de todos los pedidos en el dashboard admin
  listarPedidos: async (req, res) => {
    try {
      // Obtener todos los pedidos con la información del cliente, items y productos
      let pedidos = await Pedido.findAll({
        order: [['fecha', 'DESC']],
        include: [
          {
            model: Cliente,
            as: 'cliente',
            include: [{
              model: Usuario,
              as: 'relacion_cliente_usuario',
              attributes: ['nombre', 'apellido', 'email']
            }]
          },
          {
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
          }
        ]
      });

      // Serializamos a formato JSON simple para Handlebars
      pedidos = pedidos.map(p => {
        const pedidoPlain = p.get({ plain: true });
        
        // Formatear opciones para el select de estado
        pedidoPlain.isPendiente = pedidoPlain.estado === 'pendiente';
        pedidoPlain.isConfirmado = pedidoPlain.estado === 'confirmado';
        pedidoPlain.isEnviado = pedidoPlain.estado === 'enviado';
        pedidoPlain.isEntregado = pedidoPlain.estado === 'entregado';
        pedidoPlain.isCancelado = pedidoPlain.estado === 'cancelado';
        
        return pedidoPlain;
      });

      res.render('admin_pedidos', {
        title: 'Gestión de Pedidos',
        layout: 'adminLayout',
        pedidos: pedidos
      });

    } catch (error) {
      console.error('Error al obtener los pedidos para admin:', error);
      req.flash('varEstiloMensaje', 'danger');
      req.flash('varMensaje', 'Ocurrió un error al cargar la lista de pedidos.');
      res.redirect('/admin/dashboard');
    }
  },

  // Actualizar el estado de un pedido
  actualizarEstado: async (req, res) => {
    try {
      const { id_pedido } = req.params;
      const { nuevoEstado } = req.body;

      const estadosValidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
      
      if (!estadosValidos.includes(nuevoEstado)) {
        req.flash('varEstiloMensaje', 'danger');
        req.flash('varMensaje', 'Estado no válido.');
        return res.redirect('/admin/pedidos');
      }

      const pedido = await Pedido.findByPk(id_pedido);
      if (!pedido) {
        req.flash('varEstiloMensaje', 'danger');
        req.flash('varMensaje', 'Pedido no encontrado.');
        return res.redirect('/admin/pedidos');
      }

      // Actualizar estado en la base de datos
      pedido.estado = nuevoEstado;
      await pedido.save();

      req.flash('varEstiloMensaje', 'success');
      req.flash('varMensaje', `El estado del pedido #${id_pedido} ha sido actualizado a: ${nuevoEstado.toUpperCase()}.`);
      res.redirect('/admin/pedidos');

    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      req.flash('varEstiloMensaje', 'danger');
      req.flash('varMensaje', 'Error al actualizar el estado del pedido.');
      res.redirect('/admin/pedidos');
    }
  }
};

module.exports = adminPedidoController;
