const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require('./src/database/conexionDB');
require('dotenv').config();
require('./src/models/asociacion');

const session = require("express-session");
const flash = require("connect-flash");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//configuracion para recibir datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//configuracion de la sesion
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secreto_super_seguro",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
    },
  })
);

//configuracion de flash messages
app.use(flash());

//middleware para flash messages y usuario en las vistas
app.use((request, response, next) => {
  response.locals.varEstiloMensaje = request.flash("varEstiloMensaje");
  response.locals.varMensaje = request.flash("varMensaje");
  response.locals.user = request.session.user || null;
  next();
});

//importa el motor de plantillas handlebars
const path = require("path");
const exphbs = require("express-handlebars");
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "./src/views/layouts"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      // Helper para generar un rango de números
      range: function (start, end) {
        const result = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
        return result;
      },
      // Helper para comparar igualdad
      eq: function (a, b) {
        return a === b;
      },
      // Helper para mayor que
      gt: function (a, b) {
        return a > b;
      },
      // Helper para sumar
      add: function (a, b) {
        return a + b;
      },
      sum: function (a, b) {
        return a + b;
      },
      // Helper para restar
      subtract: function (a, b) {
        return a - b;
      },
      subtractOne: function (a) {
        return a - 1;
      },
      // Helper para unless (opuesto de if)
      unless: function (condition, options) {
        return !condition ? options.fn(this) : options.inverse(this); 
      },
      // Helper para truncar texto
      truncate: function (text, length) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
      },
      // Helper para sumar stock de inventario
      getSumStock: function (inventarioArray) {
        if (!Array.isArray(inventarioArray)) return 0;
        return inventarioArray.reduce((sum, item) => sum + (item.stock || 0), 0);
      },
      // Helper para formatear fechas (DD/MM/YYYY HH:MM)
      formatearFecha: function(fechaStr) {
        if (!fechaStr) return '';
        const fecha = new Date(fechaStr);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${año} ${horas}:${minutos}`;
      }
    },
  })
);

//configura la ruta de las vistas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, "src/public")));

//rutas
const homeRuta = require("./src/routes/homeRuta");
app.use("/", homeRuta);
const loginRuta = require("./src/routes/loginRuta");
app.use("/inicioSesion", loginRuta);
app.use("/", loginRuta);
const usuarioRuta = require("./src/routes/usuarioRuta");
app.use("/", usuarioRuta);
const adminRuta = require("./src/routes/adminRuta");
app.use("/admin", adminRuta);
const categoriaRuta = require("./src/routes/categoriaRuta");
app.use("/admin/dashboard", categoriaRuta);
const proveedorRuta = require("./src/routes/proveedorRuta");
app.use("/admin/dashboard", proveedorRuta);
const productosRuta = require("./src/routes/productosRuta");
app.use("/admin/dashboard", productosRuta);
const inventarioRoutes = require('./src/routes/inventarioRuta');
app.use('/admin/dashboard', inventarioRoutes);
app.use('/catalogo', require('./src/routes/catalogoRuta'));
const carritoRuta = require('./src/routes/carritoRuta');
app.use('/carrito', carritoRuta);
const pedidoRuta = require('./src/routes/pedidoRuta');
app.use('/', pedidoRuta);

//conexion y sincronizacion con la base de datos
const PORT = process.env.PORT || 3000;

// Sincronizar base de datos y crear tablas
sequelize.sync().then(() => {
  console.log('Base de datos conectada correctamente');
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch(error => {
  console.error('Error al sincronizar la base de datos:', error);
  process.exit(1);
});
