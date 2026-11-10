require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✔ Conectado a MySQL');
  } catch (e) {
    console.error('✖ No se pudo conectar a MySQL:', e.message);
    process.exit(1);
  }
  // 0.0.0.0 para que sea accesible desde otros dispositivos / contenedores
  app.listen(PORT, '0.0.0.0', () => console.log(`API en http://0.0.0.0:${PORT}`));
})();
