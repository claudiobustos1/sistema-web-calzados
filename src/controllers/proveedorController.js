const Proveedor = require("../models/proveedor");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

const proveedorController = {
    //paginacion y buscador de proveedor
    proveedor: async (req, res) => {
        try {
            const { page = 1, search = '' } = req.query;
                  const limit = 5;
                  const offset = (page - 1) * limit;
            
                  let whereCondition = {};
                  if (search) {
                    whereCondition = {
                      empresa: {
                        [Op.like]: `%${search}%`
                      }
                    };
                  }
                    const { count, rows: proveedores } = await Proveedor.findAndCountAll({  
                      where: whereCondition,
                      limit,
                      offset,
                      order: [['empresa', 'ASC']]
                    });
                     const totalPages = Math.ceil(count / limit);

      res.render("proveedores", {
        title: "proveedores",
        layout : "adminLayout",
        proveedores,
        currentPage: parseInt(page),
        totalPages,
        search,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
        totalCategorias: count
      });
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      req.flash("varMensaje", "Error al cargar los proveedores");
      req.flash("varEstiloMensaje", "danger");
      res.redirect("/admin/dashboard/proveedores");
    }
  },
//formulario de crear proveedor
  formproveedor: (req, res) => {
    res.render("crear_proveedor", {
      title: "Crear proveedor - calzado online",
      layout : "adminLayout",
      usuario: req.session.usuario,
    });
  },
//registro de proveedor
crear: async (req, res) => {
    const { empresa,contacto,telefono,email,} = req.body;
    const proveedorExiste= await Proveedor.findAll({ where: { empresa } });
    if (proveedorExiste.length > 0) {
      req.flash("varMensaje", "El proveedor ya existe");
      req.flash("varEstiloMensaje", "danger");
      return res.redirect("/admin/dashboard/proveedores/crear");
    }
    if(await Proveedor.findOne({ where: { email } })){
        req.flash("varMensaje", "El email ya está en uso");
        req.flash("varEstiloMensaje", "danger");
        return res.redirect("/admin/dashboard/proveedores/crear");
    }
    try{
        let nuevoProveedor = await Proveedor.create({
            empresa,
            contacto,
            telefono,
            email
        });
        req.flash("varMensaje", "Proveedor creado exitosamente");
        req.flash("varEstiloMensaje", "success");
        return  res.redirect("/admin/dashboard/proveedores");

    } catch (error) {
        console.error("Error al crear proveedor:", error);
        req.flash("varMensaje", "Error al crear el proveedor");
        req.flash("varEstiloMensaje", "danger");
        return res.redirect("/admin/dashboard/proveedores/crear");
    }

},
mostrarEditar: async (req, res) => {
    const proveedorEditar = await Proveedor.findByPk(req.params.id);
      res.render('editar_proveedor', {
        title: "Editar proveedor - tienda online",
        layout : "adminLayout",
        proveedor: proveedorEditar
      });
},
editarProveedor: async (req,res) => {
    const { id } = req.params;
    const { empresa,contacto,telefono,email } = req.body;
    try {
      const proveedorExiste = await Proveedor.findByPk(id);
      if (proveedorExiste) {
        const proveedorEmpresa = await Proveedor.findOne({ where: { empresa } });
        if(proveedorEmpresa){
          req.flash("varMensaje", "El proveedor ya existe");
          req.flash("varEstiloMensaje", "danger");
          return res.redirect("/admin/dashboard/proveedores/editar/" + id);
        }
     }
     await Proveedor.update({ empresa, contacto, telefono, email }, { where: { id_proveedor: id } });
      req.flash("varMensaje", "Proveedor editado con exito");
      req.flash("varEstiloMensaje", "success");
      res.redirect("/admin/dashboard/proveedores");
    } catch (error) {
      console.error("Error al editar proveedor:", error);
      req.flash("varMensaje", "Error al editar el proveedor");
      req.flash("varEstiloMensaje", "danger");
      res.redirect("/admin/dashboard/proveedores/editar/" + id);
    }
  },
  eliminarProveedor: async (req,res) =>{
    const { id } = req.params;
    try {
      await Proveedor.destroy({ where: { id_proveedor: id } });
      req.flash("varMensaje", "Proveedor eliminado con exito");
      req.flash("varEstiloMensaje", "success");
      res.redirect("/admin/dashboard/proveedores");
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      req.flash("varMensaje", "Error al eliminar el proveedor");
      req.flash("varEstiloMensaje", "danger");
      res.redirect("/admin/dashboard/proveedores");
    }
    
  }}

module.exports = proveedorController;