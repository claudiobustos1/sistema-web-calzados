
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Inventario = require('../models/inventario');
const { Op } = require('sequelize');

const catalogoController = {
  // Listar todos los productos del catálogo con búsqueda y filtros
  listar: async (req, res) => {
    try {
      const { page = 1, search = '', categoria = '' } = req.query;
      const limit = 12;
      const offset = (page - 1) * limit;

      let whereCondition = {};

      // Filtro de búsqueda
      if (search) {
        whereCondition = {
          ...whereCondition,
          [Op.or]: [
            { nombre: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } }
          ]
        };
      }

      // Filtro por categoría
      let categoriaObj = null;
      if (categoria) {
        categoriaObj = await Categoria.findOne({ where: { nombre } });
        if (categoriaObj) {
          whereCondition.id_categoria = categoriaObj.id_categoria;
        }
      }

      // Obtener productos con paginación
      const { count, rows: productos } = await Producto.findAndCountAll({
        where: whereCondition,
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Inventario, as: 'inventario' }
        ],
        limit,
        offset,
        order: [['nombre', 'ASC']]
      });

      // Obtener todas las categorías para el filtro
      const categorias = await Categoria.findAll({ order: [['nombre', 'ASC']] });

      const totalPages = Math.ceil(count / limit);

      res.render('catalogo', {
        title: 'Catálogo de Productos',
        layout: 'main',
        productos,
        categorias,
        currentPage: parseInt(page),
        totalPages,
        search,
        categoria,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
        totalProductos: count
      });
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
      req.flash('varMensaje', 'Error al cargar productos');
      req.flash('varEstiloMensaje', 'danger');
      res.redirect('/');
    }
  },

  // Obtener detalles de un producto específico
  detalle: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscar producto con sus relaciones
      const producto = await Producto.findByPk(id, {
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Inventario, as: 'inventario' }
        ]
      });

      if (!producto) {
        req.flash('varMensaje', 'Producto no encontrado');
        req.flash('varEstiloMensaje', 'danger');
        return res.redirect('/catalogo');
      }

      // Productos relacionados (misma categoría)
      const productosRelacionados = await Producto.findAll({
        where: {
          id_categoria: producto.id_categoria,
          id_producto: { [Op.not]: id }
        },
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Inventario, as: 'inventario' }
        ],
        limit: 4,
        order: [['nombre', 'ASC']]
      });

      res.render('detalle_producto', {
        title: producto.nombre,
        layout: 'main',
        producto,
        productosRelacionados
      });
    } catch (error) {
      console.error('Error al obtener detalle:', error);
      req.flash('varMensaje', 'Error al cargar producto');
      req.flash('varEstiloMensaje', 'danger');
      res.redirect('/catalogo');
    }
  },

  // Buscar productos (para búsqueda rápida)
  buscar: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim().length === 0) {
        return res.json({ productos: [] });
      }

      const productos = await Producto.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.like]: `%${q}%` } },
            { descripcion: { [Op.like]: `%${q}%` } }
          ]
        },
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Inventario, as: 'inventario' }
        ],
        limit: 10
      });

      res.json({ productos });
    } catch (error) {
      console.error('Error en búsqueda:', error);
      res.json({ productos: [], error: 'Error en la búsqueda' });
    }
  },

  // Filtrar por categoría
  porCategoria: async (req, res) => {
    try {
      const { id_categoria, page = 1 } = req.params;
      const limit = 12;
      const offset = (page - 1) * limit;

      const categoria = await Categoria.findByPk(id_categoria);
      if (!categoria) {
        req.flash('varMensaje', 'Categoría no encontrada');
        req.flash('varEstiloMensaje', 'danger');
        return res.redirect('/catalogo');
      }

      const { count, rows: productos } = await Producto.findAndCountAll({
        where: {
          id_categoria
        },
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Inventario, as: 'inventario' }
        ],
        limit,
        offset,
        order: [['nombre', 'ASC']]
      });

      const categorias = await Categoria.findAll({ order: [['nombre', 'ASC']] });
      const totalPages = Math.ceil(count / limit);

      res.render('catalogo', {
        title: `Catálogo - ${categoria.nombre}`,
        layout: 'main',
        productos,
        categorias,
        currentPage: parseInt(page),
        totalPages,
        categoria: categoria.nombre,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
        totalProductos: count
      });
    } catch (error) {
      console.error('Error al filtrar por categoría:', error);
      req.flash('varMensaje', 'Error al filtrar productos');
      req.flash('varEstiloMensaje', 'danger');
      res.redirect('/catalogo');
    }
  }
};

module.exports = catalogoController;
  