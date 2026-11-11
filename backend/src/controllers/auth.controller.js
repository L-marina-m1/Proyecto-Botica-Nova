const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { AppError, asyncHandler } = require('../utils/AppError');

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Credenciales incorrectas', 401);
  }
  const payload = { id: user.id, nombre: user.nombre, rol: user.rol };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
  res.json({ ok: true, token, usuario: { ...payload, email: user.email } });
});

exports.registrar = asyncHandler(async (req, res) => {
  const { nombre, email, password, rol = 'vendedor' } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const [r] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?,?,?,?)',
    [nombre, email, hash, rol]
  );
  res.status(201).json({ ok: true, id: r.insertId, nombre, email, rol });
});

exports.perfil = asyncHandler(async (req, res) => {
  res.json({ ok: true, usuario: req.usuario });
});
