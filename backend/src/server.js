require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    // Verificar configuración necesaria
    const variablesRequeridas = [
      'DB_HOST',
      'DB_USER',
      'DB_NAME',
      'JWT_SECRET'
    ];

    for (const variable of variablesRequeridas) {
      if (!process.env[variable]) {
        throw new Error(`Falta configurar la variable ${variable}`);
      }
    }

    // Verificar longitud del secreto JWT
    if (process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
    }

    // Comprobar conexión con MySQL
    await pool.query('SELECT 1');

    console.log('✔ Conectado correctamente a MySQL');
    console.log(`✔ Base de datos: ${process.env.DB_NAME}`);

    // Iniciar servidor
    const servidor = app.listen(PORT, '0.0.0.0', () => {
      console.log('-----------------------------------');
      console.log(' BOTICA NOVA SALUD');
      console.log('-----------------------------------');
      console.log(`✔ Servidor iniciado en puerto ${PORT}`);
      console.log(`✔ API: http://localhost:${PORT}`);
      console.log(`✔ Health: http://localhost:${PORT}/api/health`);
      console.log('-----------------------------------');
    });

    // Cierre ordenado
    const cerrarServidor = async () => {
      console.log('\nCerrando servidor...');

      servidor.close(async () => {
        await pool.end();
        console.log('✔ Servidor cerrado correctamente');
        process.exit(0);
      });
    };

    process.on('SIGINT', cerrarServidor);
    process.on('SIGTERM', cerrarServidor);

  } catch (error) {
    console.error('✖ Error al iniciar Botica Nova Salud:');
    console.error(error.message);

    await pool.end().catch(() => {});
    process.exit(1);
  }
}

iniciarServidor();
