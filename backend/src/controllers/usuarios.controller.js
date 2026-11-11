const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { AppError, asyncHandler } = require('../utils/AppError');

const CAMPOS = 'id, nombre, email, rol, activo, created_at';

// GET /api/usuarios
exports.listar = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`SELECT ${CAMPOS} FROM usuarios ORDER BY nombre`);
  res.json({
    ok: true,
    total: rows.length,
    data: rows.map((u) => ({ ...u, activo: Boolean(u.activo) }))
  });
});

// POST /api/usuarios
exports.crear = asyncHandler(async (req, res) => {
  const { nombre, email, password, rol = 'vendedor' } = req.body;

  const [existentes] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existentes.length) {
    throw new AppError('El correo electrónico ya está registrado', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [r] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, 1)',
    [nombre, email, passwordHash, rol]
  );

  res.status(201).json({ ok: true, mensaje: 'Usuario creado correctamente', id: r.insertId });
});

// PUT /api/usuarios/:id  (nombre, email, rol, activo, password: todos opcionales)
exports.actualizar = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, email, rol, activo, password } = req.body;

  const [rows] = await pool.query('SELECT id, rol, activo FROM usuarios WHERE id = ?', [id]);
  const actual = rows[0];
  if (!actual) throw new AppError('Usuario no encontrado', 404);

  const nuevoRol = rol !== undefined ? rol : actual.rol;
  const nuevoActivo = activo !== undefined ? Boolean(activo) : Boolean(actual.activo);

  // Protección: no dejar el sistema sin administradores activos
  const dejaDeSerAdminActivo =
    actual.rol === 'admin' && actual.activo && (nuevoRol !== 'admin' || !nuevoActivo);

  if (dejaDeSerAdminActivo) {
    if (id === req.usuario.id) {
      throw new AppError('No puedes quitarte el rol de administrador ni desactivar tu propia cuenta', 409);
    }
    const [[otros]] = await pool.query(
      "SELECT COUNT(*) AS n FROM usuarios WHERE rol = 'admin' AND activo = 1 AND id <> ?",
      [id]
    );
    if (!otros.n) {
      throw new AppError('Debe existir al menos un administrador activo', 409);
    }
  }

  const campos = [];
  const valores = [];

  if (nombre !== undefined) { campos.push('nombre = ?'); valores.push(nombre); }
  if (email !== undefined) { campos.push('email = ?'); valores.push(email); }
  if (rol !== undefined) { campos.push('rol = ?'); valores.push(rol); }
  if (activo !== undefined) { campos.push('activo = ?'); valores.push(nuevoActivo ? 1 : 0); }
  if (password) {
    campos.push('password_hash = ?');
    valores.push(await bcrypt.hash(password, 12));
  }

  if (!campos.length) throw new AppError('No se enviaron datos para actualizar', 400);

  valores.push(id);
  await pool.query(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, valores);

  res.json({ ok: true, mensaje: 'Usuario actualizado correctamente' });
});