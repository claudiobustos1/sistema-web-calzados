const Usuario = require("./usuario");
const Cliente = require("./cliente");
const Producto = require('./producto');
const Inventario = require('./inventario');
const Categoria = require('./categoria');
const Proveedor = require('./proveedor');

// Relaciones

Producto.hasMany(Inventario, { 
    foreignKey: 'id_producto',
    as: 'inventario'
});

Inventario.belongsTo(Producto, {
    foreignKey: 'id_producto',
    as: 'producto'
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