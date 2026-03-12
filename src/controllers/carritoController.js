const Carrito = require('../models/carrito');
const CarritoItem = require('../models/carritoItem');
const Inventario = require('../models/inventario');
const Producto = require('../models/producto');
const Cliente = require('../models/cliente');
const Usuario = require('../models/usuario');
const Pedido = require('../models/pedido');
const PedidoItem = require('../models/pedidoItem');

//carrito del usuario
exports.obtenerCarritoUsuario = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Buscar o crear carrito para el usuario
    let carrito = await Carrito.findOne({
      where: { id_usuario: req.session.user.id }
    });

    if (!carrito) {
      carrito = await Carrito.create({
        id_usuario: req.session.user.id
      });
    }

    // Obtener items del carrito
    const items = await CarritoItem.findAll({
      where: { id_carrito: carrito.id_carrito },
      include: [{
        model: Inventario,
        as: 'Inventario',
        attributes: ['talle'],
        include: [{
          model: Producto,
          as: 'Producto',
          attributes: ['nombre', 'precio', 'imagen']
        }]
      }]
    });

    res.json({
      id_carrito: carrito.id_carrito,
      items: items,
      total: items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Obtener carrito como HTML para mostrar en modal
exports.mostrarCarroModal = async (req, res) => {
  try {
    // Si no hay usuario en sesión, devolver carrito vacío
    if (!req.session.user) {
      return res.send(`
        <div class="text-center py-4">
          <p class="text-muted">Debes <a href="/inicioSesion">iniciar sesión</a> para ver tu carrito</p>
        </div>
      `);
    }

    // Buscar o crear carrito para el usuario
    let carrito = await Carrito.findOne({
      where: { id_usuario: req.session.user.id }
    });

    if (!carrito) {
      carrito = await Carrito.create({
        id_usuario: req.session.user.id
      });
    }

    // Obtener items del carrito con detalles del producto
    const items = await CarritoItem.findAll({
      where: { id_carrito: carrito.id_carrito },
      include: [{
        model: Inventario,
        as: 'Inventario',
        attributes: ['talle'],
        include: [{
          model: Producto,
          as: 'Producto',
          attributes: ['nombre', 'precio', 'imagen']
        }]
      }]
    });

    // Calcular total
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    if (items.length === 0) {
      return res.send(`
        <div class="text-center py-4">
          <p class="text-muted">Tu carrito está vacío</p>
          <a href="/catalogo" class="btn btn-sm btn-violeta-azulado">Continuar comprando</a>
        </div>
      `);
    }

    // Generar HTML con los items del carrito
    let html = `
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Talle</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
    `;

    items.forEach(item => {
      const producto = item.Inventario.Producto;
      html += `
        <tr>
          <td>${producto.nombre}</td>
          <td>${item.Inventario.talle}</td>
          <td>
            <input type="number" class="form-control form-control-sm" value="${item.cantidad}" min="1" style="width: 60px;">
          </td>
          <td>$${parseFloat(producto.precio).toFixed(2)}</td>
          <td>$${parseFloat(item.subtotal).toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${item.id_item})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
      <div class="text-end">
        <h5>Total: <strong>$${total.toFixed(2)}</strong></h5>
        <a href="/carrito" class="btn btn-violeta-azulado">Ir al carrito</a>
      </div>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error al mostrar carrito:', error);
    res.send(`<p class="text-danger">Error al cargar el carrito</p>`);
  }
};

// Agregar producto al carrito
exports.agregarAlCarrito = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id_inventario, cantidad } = req.body;

    console.log('Recibido - id_inventario:', id_inventario, 'cantidad:', cantidad);
    console.log('Usuario ID:', req.session.user.id);

    if (!id_inventario || !cantidad) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    // Verificar que el inventario existe y obtener el precio del producto
    const inventario = await Inventario.findByPk(id_inventario, {
      include: [{
        model: Producto,
        as: 'Producto',
        attributes: ['nombre', 'precio', 'imagen']
      }]
    });

    console.log('Inventario encontrado:', inventario);

    if (!inventario) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Obtener o crear carrito del usuario
    let carrito = await Carrito.findOne({
      where: { id_usuario: req.session.user.id }
    });

    if (!carrito) {
      carrito = await Carrito.create({
        id_usuario: req.session.user.id
      });
    }

    console.log('Carrito - ID:', carrito.id_carrito);

    // Verificar si el item ya existe en el carrito
    let item = await CarritoItem.findOne({
      where: {
        id_carrito: carrito.id_carrito,
        id_inventario: id_inventario
      }
    });

    const subtotal = parseFloat(inventario.Producto.precio) * cantidad;

    if (item) {
      // Actualizar cantidad y subtotal
      item.cantidad += cantidad;
      item.subtotal = parseFloat(inventario.Producto.precio) * item.cantidad;
      await item.save();
      console.log('Item actualizado:', item);
    } else {
      // Crear nuevo item
      item = await CarritoItem.create({
        id_carrito: carrito.id_carrito,
        id_inventario: id_inventario,
        cantidad: cantidad,
        subtotal: subtotal
      });
      console.log('Item creado:', item);
    }

    res.json({ success: true, message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

// Eliminar item del carrito
exports.eliminarDelCarrito = async (req, res) => {
  try {
    const { id_item } = req.params;

    const item = await CarritoItem.findByPk(id_item);
    if (item) {
      await item.destroy();
      res.json({ success: true, message: 'Producto eliminado del carrito' });
    } else {
      res.status(404).json({ error: 'Item no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

// Mostrar página completa del carrito
exports.verCarrito = async (req, res) => {
  try {
    // Si no hay usuario en sesión, redirigir a login
    if (!req.session.user) {
      return res.redirect('/inicioSesion');
    }

    // Buscar o crear carrito para el usuario
    let carrito = await Carrito.findOne({
      where: { id_usuario: req.session.user.id }
    });

    if (!carrito) {
      carrito = await Carrito.create({
        id_usuario: req.session.user.id
      });
    }

    // Obtener items del carrito con detalles del producto
    const items = await CarritoItem.findAll({
      where: { id_carrito: carrito.id_carrito },
      include: [{
        model: Inventario,
        as: 'Inventario',
        attributes: ['talle'],
        include: [{
          model: Producto,
          as: 'Producto',
          attributes: ['nombre', 'precio', 'imagen']
        }]
      }]
    });

    // Calcular total
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.render('carrito', {
      title: 'Mi Carrito',
      items: items,
      total: total,
      subtotal: total,
      active: { carrito: true }
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).render('error', {
      title: 'Error',
      mensaje: 'Error al cargar el carrito'
    });
  }
};

// Actualizar cantidad del item
exports.actualizarCantidad = async (req, res) => {
  try {
    const { id_item, cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    const item = await CarritoItem.findByPk(id_item, {
      include: [{
        model: Inventario,
        as: 'Inventario',
        include: [{
          model: Producto,
          as: 'Producto'
        }]
      }]
    });

    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    // Actualizar cantidad y subtotal
    item.cantidad = cantidad;
    item.subtotal = parseFloat(item.Inventario.Producto.precio) * cantidad;
    await item.save();

    res.json({
      success: true,
      item: item
    });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ error: 'Error al actualizar la cantidad' });
  }
};

// Obtener datos del cliente
exports.obtenerDatosCliente = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Buscar cliente del usuario
    let cliente = await Cliente.findOne({
      where: { id_usuario: req.session.user.id },
      include: [{
        model: Usuario,
        as: 'relacion_cliente_usuario',
        attributes: ['nombre', 'apellido', 'email']
      }]
    });

    if (!cliente) {
      // Si no existe, crear uno vacío con datos del usuario
      const usuario = await Usuario.findByPk(req.session.user.id);
      cliente = {
        id_usuario: req.session.user.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        ciudad: '',
        direccion: '',
        telefono: ''
      };
    }

    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener datos del cliente:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
};

// Guardar datos del cliente
exports.guardarDatosCliente = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { ciudad, direccion, telefono } = req.body;

    if (!ciudad || !direccion || !telefono) {
      return res.status(400).json({ error: 'Ciudad, dirección y teléfono son obligatorios' });
    }

    // Buscar o crear cliente
    let cliente = await Cliente.findOne({
      where: { id_usuario: req.session.user.id }
    });

    if (cliente) {
      // Actualizar cliente existente
      cliente.ciudad = ciudad;
      cliente.direccion = direccion;
      cliente.telefono = telefono;
      await cliente.save();
    } else {
      // Crear nuevo cliente
      cliente = await Cliente.create({
        id_usuario: req.session.user.id,
        ciudad: ciudad,
        direccion: direccion,
        telefono: telefono
      });
    }

    res.json({ success: true, cliente: cliente });
  } catch (error) {
    console.error('Error al guardar datos del cliente:', error);
    res.status(500).json({ error: 'Error al guardar datos' });
  }
};

// Procesar pedido (checkout)
exports.procesarPedido = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { ciudad, direccion, telefono } = req.body;

    if (!ciudad || !direccion || !telefono) {
      return res.status(400).json({ error: 'Ciudad, dirección y teléfono son obligatorios' });
    }

    // 1. Guardar/Actualizar datos del cliente
    let cliente = await Cliente.findOne({
      where: { id_usuario: req.session.user.id }
    });

    if (cliente) {
      cliente.ciudad = ciudad;
      cliente.direccion = direccion;
      cliente.telefono = telefono;
      await cliente.save();
    } else {
      cliente = await Cliente.create({
        id_usuario: req.session.user.id,
        ciudad: ciudad,
        direccion: direccion,
        telefono: telefono
      });
    }

    // 2. Obtener carrito del usuario
    const carrito = await Carrito.findOne({
      where: { id_usuario: req.session.user.id }
    });

    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // 3. Obtener items del carrito
    const items = await CarritoItem.findAll({
      where: { id_carrito: carrito.id_carrito }
    });

    if (items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // 4. Calcular total
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    // 5. Crear pedido
    const pedido = await Pedido.create({
      id_cliente: cliente.id_cliente,
      total: total,
      estado: 'pendiente'
    });

    // 6. Crear items del pedido
    for (const carritoItem of items) {
      const inventario = await Inventario.findByPk(carritoItem.id_inventario, {
        include: [{
          model: Producto,
          as: 'Producto'
        }]
      });

      await PedidoItem.create({
        id_pedido: pedido.id_pedido,
        id_inventario: carritoItem.id_inventario,
        cantidad: carritoItem.cantidad,
        precioxUni: inventario.Producto.precio,
        subTotal: carritoItem.subtotal
      });

      // 6.5 Descontar del inventario
      if (inventario.stock >= carritoItem.cantidad) {
        inventario.stock -= carritoItem.cantidad;
        await inventario.save();
      } else {
        // En un caso real se podría abortar el pedido o manejar excedentes,
        // pero por ahora solo aseguramos que no quede negativo (opcional)
        inventario.stock = 0;
        await inventario.save();
      }
    }

    // 7. Vaciar carrito (eliminar todos los items)
    await CarritoItem.destroy({
      where: { id_carrito: carrito.id_carrito }
    });

    res.json({
      success: true,
      mensaje: '¡Pedido realizado exitosamente!',
      id_pedido: pedido.id_pedido,
      total: total
    });
  } catch (error) {
    console.error('Error al procesar pedido:', error);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
};
