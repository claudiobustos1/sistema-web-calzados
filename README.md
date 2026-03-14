# Sistema Web de Calzados 👞👟

Un sistema web completo para la gestión de una tienda de calzados. Este proyecto está desarrollado con **Node.js, Express, Sequelize y Handlebars**, y permite tanto a los clientes explorar y comprar productos, como a los administradores gestionar el inventario de la tienda.

## 🌐 Demo en Vivo

Puedes probar y utilizar el sistema en línea a través de su despliegue en Railway:
**[Ver proyecto en Railway](sistema-web-calzados-production.up.railway.app)**

## Características Principales

### Para Clientes:
- **Catálogo de Calzados:** Visualización de todos los productos disponibles con barra de búsqueda funcional.
- **Carrito de Compras:** Posibilidad de agregar calzados al carrito guiando el stock disponible.
- **Perfil de Usuario:** Panel personal para gestionar los datos de envío (Ciudad, Dirección, Teléfono) y cambiar la contraseña.
- **Historial de Pedidos:** Sección para revisar las compras realizadas, subtotales y estados de envío.
- **Autenticación:** Registro e inicio de sesión seguro de usuarios con `bcrypt`.

### Para Administradores (Dashboard):
- **Panel Principal en Vivo:** Visualización de métricas en tiempo real (Ingresos Totales, Usuarios Activos, Últimas Ventas y Estado de Stock).
- **Gestión de Pedidos:** Módulo completo para visualizar todas las compras realizadas en la plataforma y actualizar sus estados (Pendiente, Enviado, Entregado, Cancelado).
- **Gestión de Productos:** Crear, editar y eliminar calzados del catálogo (con subida de imágenes).
- **Gestión de Categorías y Proveedores:** Administrar el inventario categorizado y la información de los suplidores.
- **Control de Inventario Avanzado:** Gestionar el stock disponible de los calzados de forma independiente por modelo y talle.

## Tecnologías Utilizadas

- **Backend:** Node.js, Express
- **Frontend / Vistas:** Express-Handlebars, Bootstrap / Materialize CSS
- **Base de Datos:** MySQL
- **ORM:** Sequelize
- **Autenticación y Sesiones:** bcrypt, express-session, connect-flash

## ⚙️ Requisitos Previos

Asegúrate de tener instalado en tu sistema local:
- [Node.js](https://nodejs.org/es/) (v14 o superior recomendado)
- [MySQL](https://www.mysql.com/) (O un entorno como XAMPP/WAMP/MAMP)

## 📖 Instrucciones de Instalación y Uso

1. **Clonar o descargar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd web_calzado
   ```

2. **Instalar las dependencias:**
   Ejecuta el siguiente comando para instalar todos los paquetes necesarios enumerados en el `package.json`:
   ```bash
   npm install
   ```

3. **Configurar la Base de Datos:**
   - Asegúrate de que el servicio de MySQL esté en ejecución.
   - Crea un archivo `.env` en la raíz del proyecto  con las credenciales de tu base de datos:
     ```env
     DB_NAME=web_calzados
     DB_USER=root
     DB_PASSWORD=
     DB_HOST=localhost
     DB_PORT=3306
     SESSION_SECRET=secreto_super_seguro
     PORT=3000
     ```
   - *Nota: Asegúrate de crear la base de datos llamada `web_calzados` en MySQL previamente (usualmente en phpMyAdmin o ejecutando `CREATE DATABASE web_calzados;`).*

4. **Sincronizar la Base de Datos y Ejecutar el Servidor:**
   Aprovechando la funcionalidad del programa, Sequelize se encargará automáticamente de sincronizar los modelos y crear las tablas necesarias en la base de datos al arrancar el proyecto.
   ```bash
   npm start
   ```
   Verás en consola un mensaje indicando que el servidor está corriendo en el puerto 3000 y que la base de datos se ha sincronizado correctamente.

   ```

5. **Acceder al Sistema:**
   - Abre tu navegador web e ingresa a: `http://localhost:3000`
   - Ingresa con las credenciales que se crearon en el paso anterior si necesitas entrar al panel de administración general o bien puedes navegar y registrarte como un cliente normal.

## 📁 Estructura del Proyecto

- `src/controllers/`: Controladores con toda la lógica central del negocio.
- `src/models/`: Modelos y asociaciones de la Base de Datos usando Sequelize.
- `src/routes/`: Rutas organizadas del servidor (Inicio, Admin, Usuarios, Carrito, Inventario, etc).
- `src/views/`: Plantillas Handlebars (`.hbs`) para renderizar el Frontend.
- `src/public/`: Archivos estáticos accesibles por el navegador (hojas de estilo CSS, scripts e imágenes).
- `src/database/`: Archivo configurador de conexión a la BD MySQL.
- `.env`: Variables de entorno y credenciales (local).
- `index.js`: Archivo principal o entry point del servidor Express.
