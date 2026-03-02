const categoria = require("../models/categoria");
const { Op } = require("sequelize");
const categoriaController = {
  categoria: async (req, res) => {
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

      const { count, rows: categorias } = await categoria.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [['nombre', 'ASC']]
      });

      const totalPages = Math.ceil(count / limit);

      res.render("categorias", {
        title: "Categorías",
        layout : "adminLayout",
        categorias,
        currentPage: parseInt(page),
        totalPages,
        search,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
        totalCategorias: count
      });
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      req.flash("varMensaje", "Error al cargar las categorías");
      req.flash("varEstiloMensaje", "danger");
      res.redirect("/admin/dashboard");
    }
  },
  //formulario de crear categoria
  mostrarCrear: (req, res) => {
    res.render("crear_categoria", {
      title: "Crear categoria - calzado online",
      layout : "adminLayout",
      usuario: req.session.usuario,
    });
  },
  //registrar categoria
  crear: async (req, res) => {
    console.log("Dentro del controlador crear");
    const { nombre } = req.body;
    const categoriaExistente = await categoria.findOne({ where: { nombre } });
    if (categoriaExistente) {
      req.flash("varMensaje", "La categoria ya existe");
      return res.redirect("/admin/dashboard/categorias/crear");
    }
    try {
      let nuevaCategoria = await categoria.create({
        nombre,
      });
      req.flash("varMensaje", "Categoria creada con exito");
      req.flash("varEstiloMensaje", "success");
      res.redirect("/admin/dashboard/categorias");
    } catch (error) {
      console.error("Error al crear categoria:", error);
      req.flash("varMensaje", "Error al crear categoria");
      req.flash("varEstiloMensaje", "danger");
      res.redirect("/admin/dashboard/categorias/crear");
    }
  },
  mostrarEditar: async (req, res) => {
    const categoriaEditar = await categoria.findByPk(req.params.id);
      res.render('editar_categoria', {
        title: "Editar categoria - tienda online",
        layout : "adminLayout",
        categoria: categoriaEditar
      });
   
  },
  //editar categoria
  editarCategoria: async (req,res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
      const categoriaExistente = await categoria.findByPk(id);
      // Verificar si la categoría existe
      if(categoriaExistente.nombre !== nombre){
        const nombreExistente = await categoria.findOne({ where: { nombre } });
        if (nombreExistente) {
          req.flash("varMensaje", "La categoria ya existe");
          req.flash("varEstiloMensaje", "danger");
          return res.redirect("/admin/dashboard/categorias/editar/" + id);
        }
      }
      await categoria.update({ nombre }, { where: { id_categoria: id } });
      req.flash("varMensaje", "Categoria editada con exito");
      req.flash("varEstiloMensaje", "success");
      res.redirect("/admin/dashboard/categorias");
    } catch (error) {
      console.error("Error al editar categoria:", error);
      req.flash("varMensaje", "Error al editar categoria");
      req.flash("varEstiloMensaje", "danger");
      res.redirect("/admin/dashboard/categorias/editar/" + id);
    }
  },
  
  //eliminar categoria
  eliminarCategoria: async (req,res) => {
    const { id_categoria } = req.params;
    try {
      await categoria.destroy({ where: {id_categoria } });
      req.flash("varMensaje", "Categoria eliminada con exito");
      req.flash("varEstiloMensaje", "success");
      res.redirect("/admin/dashboard/categorias");
    } catch (error) {
      console.error("Error al eliminar categoria:", error);
      req.flash("varMensaje", "Error al eliminar categoria");
      req.flash("varEstiloMensaje", "danger");
      res.redirect("/admin/dashboard/categorias");
    }
  }
};
module.exports = categoriaController;

