const Inventario = require('../models/inventario');
const Producto = require('../models/producto');
const { validationResult } = require('express-validator');

const inventarioController = {
  listarPorProducto: async (req, res) => {
    try {
      const id = req.params.id;
      const producto = await Producto.findByPk(id);
      if (!producto) {
        req.flash('varMensaje','Producto no encontrado');
        req.flash('varEstiloMensaje','danger');
        return res.redirect('/admin/dashboard/productos');
      }
      const talles = await Inventario.findAll({ where: { id_producto: id }});
      return res.render('inventario_listar', { layout: 'adminLayout', producto, talles });
    } catch (err) {
      console.error(err);
      req.flash('varMensaje','Error cargando inventario');
      req.flash('varEstiloMensaje','danger');
      return res.redirect('/admin/dashboard/productos');
    }
  },

  mostrarCrear: async (req, res) => {
    const id = req.params.id;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      req.flash('varMensaje','Producto no encontrado');
      req.flash('varEstiloMensaje','danger');
      return res.redirect('/admin/dashboard/productos');
    }
    return res.render('inventario_registrar', { layout: 'adminLayout', producto });
  },

  crear: async (req, res) => {
    try {
      const id = req.params.id;
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        req.flash('varMensaje', errores.array().map(e => e.msg).join(' - '));
        req.flash('varEstiloMensaje', 'danger');
        return res.redirect(`/admin/dashboard/productos/${id}/inventario/registrar`);
      }

      const { talle, stock } = req.body;
      const talleNum = Number(talle);
      const stockNum = Number(stock);

      // comprobar producto
      const producto = await Producto.findByPk(id);
      if (!producto) {
        req.flash('varMensaje', 'Producto no encontrado');
        req.flash('varEstiloMensaje', 'danger');
        return res.redirect('/admin/dashboard/productos');
      }

      // comprobar existencia de (id_producto, talle)
      const existente = await Inventario.findOne({ where: { id_producto: id, talle: talleNum } });
      if (existente) {
        req.flash('varMensaje', 'Ese talle ya está registrado para este producto');
        req.flash('varEstiloMensaje', 'danger');
        return res.redirect(`/admin/dashboard/productos/${id}/inventario/registrar`);
      }

      // crear nuevo registro
      await Inventario.create({ id_producto: id, talle: talleNum, stock: stockNum });

      req.flash('varMensaje', 'Talle agregado correctamente');
      req.flash('varEstiloMensaje', 'success');
      return res.redirect('/admin/dashboard/productos');
    } catch (err) {
      console.error(err);
      req.flash('varMensaje', 'Error al registrar talle');
      req.flash('varEstiloMensaje', 'danger');
      return res.redirect('/admin/dashboard/productos');
    }
  },

  mostrarEditar: async (req, res) => {
    const id_inv = req.params.id_inv;
    const item = await Inventario.findByPk(id_inv);
    if (!item) {
      req.flash('varMensaje','Registro no encontrado');
      req.flash('varEstiloMensaje','danger');
      return res.redirect('/admin/dashboard/productos');
    }
    return res.render('inventario_editar', { layout: 'adminLayout', item });
  },

  editar: async (req, res) => {
    try {
      const id_inv = req.params.id_inv;
      const { talle, stock } = req.body;
      await Inventario.update({ talle, stock: Number(stock) || 0 }, { where: { id_inventario: id_inv }});
      req.flash('varMensaje','Inventario actualizado');
      req.flash('varEstiloMensaje','success');
      return res.redirect('/admin/dashboard/productos');
    } catch (err) {
      console.error(err);
      req.flash('varMensaje','Error al actualizar');
      req.flash('varEstiloMensaje','danger');
      return res.redirect('/admin/dashboard/productos');
    }
  },

  eliminar: async (req, res) => {
    try {
      const id_inv = req.params.id_inv;
      await Inventario.destroy({ where: { id_inventario: id_inv }});
      req.flash('varMensaje','Talle eliminado');
      req.flash('varEstiloMensaje','success');
      return res.redirect('/admin/dashboard/productos');
    } catch (err) {
      console.error(err);
      req.flash('varMensaje','Error al eliminar');
      req.flash('varEstiloMensaje','danger');
      return res.redirect('/admin/dashboard/productos');
    }
  }
};

module.exports = inventarioController;