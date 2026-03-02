console.log('🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA\n');

async function diagnostico() {
    try {
        // 1. Verificar conexión a la base de datos
        console.log('1. Probando conexión a la base de datos...');
        const { sequelize, ensureDatabase } = require('./src/database/conexionDB');
        console.log('   ✅ Módulo conexionDB cargado');
        
        await ensureDatabase();
        console.log('   ✅ Base de datos verificada');
        
        await sequelize.authenticate();
        console.log('   ✅ Autenticación exitosa');
        
        // 2. Verificar modelo Usuario
        console.log('\n2. Probando modelo Usuario...');
        const Usuario = require('./src/models/usuario');
        console.log('   ✅ Modelo Usuario cargado:', typeof Usuario);
        console.log('   ✅ Nombre del modelo:', Usuario.name);
        console.log('   ✅ Tabla:', Usuario.tableName);
        
        // 3. Verificar sincronización
        console.log('\n3. Probando sincronización...');
        await sequelize.sync({ force: false });
        console.log('   ✅ Modelos sincronizados');
        
        // 4. Verificar operaciones CRUD básicas
        console.log('\n4. Probando operaciones CRUD...');
        
        // Count de usuarios
        const userCount = await Usuario.count();
        console.log(`   ✅ Conteo de usuarios: ${userCount}`);
        
        // Intentar crear un usuario de prueba
        const testUser = await Usuario.create({
            nombre: 'Test',
            apellido: 'User',
            email: 'test@test.com',
            password: 'test123',
            rol: 'cliente'
        });
        console.log('   ✅ Usuario de prueba creado:', testUser.id_usuario);
        
        // Eliminar usuario de prueba
        await Usuario.destroy({ where: { email: 'test@test.com' } });
        console.log('   ✅ Usuario de prueba eliminado');
        
        console.log('\n🎉 DIAGNÓSTICO COMPLETADO - TODO FUNCIONA CORRECTAMENTE');
        
    } catch (error) {
        console.error('\n❌ ERROR EN EL DIAGNÓSTICO:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        if (typeof sequelize !== 'undefined') {
            await sequelize.close();
            console.log('🔒 Conexión cerrada');
        }
    }
}

diagnostico();