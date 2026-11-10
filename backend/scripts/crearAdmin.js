require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

(async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@botica.com';
  const pass = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(pass, 10);
  await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ('Administrador', ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`, [email, hash]);
  console.log(`Admin listo -> ${email} / ${pass}  (cambia la contraseña luego)`);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
