const Usuario = require("./usuario");
const Cliente = require("./cliente");
const Producto = require('./producto');
const Inventario = require('./inventario');
const Categoria = require('./categoria');
const Proveedor = require('./proveedor');
const Carrito = require('./carrito');
const CarritoItem = require('./carritoItem');
const Pedido = require('./pedido');
const PedidoItem = require('./pedidoItem');

// Relaciones

Producto.hasMany(Inventario, { 
    foreignKey: 'id_producto',
    as: 'inventario'
});

Inventario.belongsTo(Producto, {
    foreignKey: 'id_producto',
    as: 'Producto'
});

Producto.belongsTo(Categoria, {
    foreignKey: 'id_categoria',
    as: 'categoria'
});

Producto.belongsTo(Proveedor, {
    foreignKey: 'id_proveedor',
    as: 'proveedor'
});;

//relacion usuario 1 --> 1 cliente
Usuario.hasOne(Cliente,
{
    foreignKey: 'id_usuario',
    as: 'relacion_usuario_cliente'
});
Cliente.belongsTo(Usuario,
    {
        foreignKey: 'id_usuario',
        as: 'relacion_cliente_usuario'
    });

// Relaciones del Carrito
Carrito.hasMany(CarritoItem, {
    foreignKey: 'id_carrito',
    as: 'items'
});

CarritoItem.belongsTo(Carrito, {
    foreignKey: 'id_carrito',
    as: 'carrito'
});

CarritoItem.belongsTo(Inventario, {
    foreignKey: 'id_inventario',
    as: 'Inventario'
});

Inventario.hasMany(CarritoItem, {
    foreignKey: 'id_inventario',
    as: 'carritoItems'
});

// Relaciones del Pedido
Cliente.hasMany(Pedido, {
    foreignKey: 'id_cliente',
    as: 'pedidos'
});

Pedido.belongsTo(Cliente, {
    foreignKey: 'id_cliente',
    as: 'cliente'
});

Pedido.hasMany(PedidoItem, {
    foreignKey: 'id_pedido',
    as: 'items'
});

PedidoItem.belongsTo(Pedido, {
    foreignKey: 'id_pedido',
    as: 'pedido'
});

PedidoItem.belongsTo(Inventario, {
    foreignKey: 'id_inventario',
    as: 'inventario'
});

Inventario.hasMany(PedidoItem, {
    foreignKey: 'id_inventario',
    as: 'pedidoItems'
});

module.exports = { Usuario, Cliente, Producto, Inventario, Categoria, Proveedor, Carrito, CarritoItem, Pedido, PedidoItem };