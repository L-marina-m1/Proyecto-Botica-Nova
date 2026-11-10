require('dotenv').config();

const bcrypt = require('bcryptjs');

const pool = require('../src/config/db');

async function crearAdministrador() {

  try {

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    // Verificar configuración
    if (!email || !password) {
      throw new Error(
        'Debes configurar ADMIN_EMAIL y ADMIN_PASSWORD en el archivo .env'
      );
    }

    if (password.length < 12) {
      throw new Error(
        'La contraseña del administrador debe tener al menos 12 caracteres'
      );
    }

    // Generar hash
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear o actualizar administrador
    await pool.query(
      `INSERT INTO usuarios
        (nombre, email, password_hash, rol, activo)
       VALUES (?, ?, ?, 'admin', 1)
       ON DUPLICATE KEY UPDATE
         password_hash = VALUES(password_hash),
         rol = 'admin',
         activo = 1`,
      [
        'Administrador',
        email,
        passwordHash
      ]
    );

    console.log('-----------------------------------');
    console.log(' BOTICA NOVA SALUD');
    console.log('-----------------------------------');
    console.log('✔ Administrador configurado');
    console.log(`✔ Correo: ${email}`);
    console.log('✔ Contraseña protegida mediante bcrypt');
    console.log('-----------------------------------');

  } catch (error) {

    console.error('✖ Error al crear administrador:');
    console.error(error.message);

    process.exitCode = 1;

  } finally {

    await pool.end();

  }

}

crearAdministrador();
