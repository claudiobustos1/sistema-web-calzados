const Producto = require("../models/producto");
const Categoria = require("../models/categoria");
const Proveedor = require("../models/proveedor");
const Inventario = require("../models/inventario");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { eliminar } = require("./inventarioController");

const productosController = {
    //paginacion y buscador de productos
    productos: async (req, res) => {
        try {
            const { page = 1, search = '' } = req.query;
            const limit = 5;
            const offset = (page - 1) * limit;
            let whereCondition = {};
            if (search) {
                whereCondition = {
                    nombre: {
                        [Op.like]: `%${search}%`
                    }
                };
            }

            const { count, rows } = await Producto.findAndCountAll({
                where: whereCondition,
                include: [
                    { model: Inventario, as: 'inventario', attributes: ['id_inventario', 'talle', 'stock'] },
                    { model: Categoria, as: 'categoria', attributes: ['id_categoria', 'nombre'] },
                    { model: Proveedor, as: 'proveedor' } // deja que el modelo exponga sus campos
                ],
                limit,
                offset,
                order: [['id_producto', 'ASC']]
            });

            // convertir a objetos planos y calcular stock total por producto
            const productos = rows.map(p => {
                const obj = p.toJSON();
                obj.totalStock = (obj.inventario || []).reduce((sum, it) => sum + (Number(it.stock) || 0), 0);
                return obj;
            });

            const totalPages = Math.ceil(count / limit);
            res.render("productos", {
                productos,
                title: "Productos",
                layout: "adminLayout",
                totalProductos: count,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages,
                currentPage: Number(page),
                totalPages,
                search
            });
        } catch (error) {
            console.error("Error al obtener productos:", error);
            req.flash("varMensaje", "Error al cargar los productos");
            req.flash("varEstiloMensaje", "danger");
            res.redirect("/admin/dashboard");
        }
    },
    mostrarRegistrar: async (req,res) =>{
        try {
            const categorias =  await Categoria.findAll();
            const proveedores =  await Proveedor.findAll();
            res.render("registrar_producto",{
                title: "Registrar Producto",
                layout : "adminLayout",
                categorias,
                proveedores
            });
        } catch (error) {
            req.flash("varMensaje", "Error al cargar el formulario de registro de producto");
            req.flash("varEstiloMensaje", "danger");
            res.redirect("/admin/dashboard/productos");
        }

    },
    registrarProducto: async (req,res) =>{
        try{
            const body = req.body || {};
            const { nombre, descripcion, precio, stock_minimo, id_categoria, id_proveedor } = body;
            const imagen = req.file ? req.file.filename : null;

            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                req.flash("varMensaje", errores.array().map(err => err.msg).join(' '));
                req.flash("varEstiloMensaje", "danger");
                return res.redirect("/admin/dashboard/productos/registrar");
            }

            const producto = await Producto.create({
                nombre,
                descripcion,
                precio,
                imagen,
                stock_minimo,
                id_categoria,
                id_proveedor
            });

            req.flash("varMensaje", "Producto registrado exitosamente");
            req.flash("varEstiloMensaje", "success");
            return res.redirect("/admin/dashboard/productos");
        } catch (error) {
            console.error("Error al registrar producto:", error);
            req.flash("varMensaje", "Error al registrar el producto");
            req.flash("varEstiloMensaje", "danger");
            res.redirect("/admin/dashboard/productos/registrar");
        }
    },
    eliminarProducto: async (req, res) =>{
        try {
            const { id } = req.params;
            await Producto.destroy({ where: { id_producto: id } });
            req.flash("varMensaje", "Producto eliminado exitosamente");
            req.flash("varEstiloMensaje", "success");
            res.redirect("/admin/dashboard/productos");
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            req.flash("varMensaje", "Error al eliminar el producto");
            req.flash("varEstiloMensaje", "danger");
            res.redirect("/admin/dashboard/productos");
        }
    },
    mostrarEditar: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);
            if (!producto) {
                req.flash("varMensaje", "Producto no encontrado");
                req.flash("varEstiloMensaje", "danger");
                return res.redirect("/admin/dashboard/productos");
            }
            const categorias = await Categoria.findAll();
            const proveedores = await Proveedor.findAll();
            res.render("editar_producto", {
                title: "Editar Producto",
                layout: "adminLayout",
                producto: producto.toJSON(),
                categorias,
                proveedores
            });
        } catch (error) {
            console.error("Error al mostrar editar producto:", error);
            req.flash("varMensaje", "Error al cargar el formulario de edición");
            req.flash("varEstiloMensaje", "danger");
            res.redirect("/admin/dashboard/productos");
        }
    },

    // Procesar edición del producto
    editarProducto: async (req, res) => {
        try {
            const { id } = req.params;
            const body = req.body || {};
            const { nombre, descripcion, precio, stock_minimo, id_categoria, id_proveedor } = body;
            const imagen = req.file ? req.file.filename : null;

            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                req.flash("varMensaje", errores.array().map(err => err.msg).join(' '));
                req.flash("varEstiloMensaje", "danger");
                return res.redirect(`/admin/dashboard/productos/editar/${id}`);
            }

            const updateData = {
                nombre,
                descripcion,
                precio,
                stock_minimo,
                id_categoria,
                id_proveedor
            };
            if (imagen) updateData.imagen = imagen;

            await Producto.update(updateData, { where: { id_producto: id } });

            req.flash("varMensaje", "Producto actualizado correctamente");
            req.flash("varEstiloMensaje", "success");
            return res.redirect("/admin/dashboard/productos");
        } catch (error) {
            console.error("Error al editar producto:", error);
            req.flash("varMensaje", "Error al actualizar el producto");
            req.flash("varEstiloMensaje", "danger");
            res.redirect(`/admin/dashboard/productos/editar/${req.params.id}`);
        }
    },
    
};

module.exports = productosController;