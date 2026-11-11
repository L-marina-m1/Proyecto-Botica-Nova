const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../config/db');

const {
  AppError,
  asyncHandler
} = require('../utils/AppError');

// ==========================================
// INICIAR SESIÓN
// POST /api/auth/login
// ==========================================

exports.login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const [rows] = await pool.query(
    `SELECT id, nombre, email, password_hash, rol, activo
     FROM usuarios
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  const usuario = rows[0];

  if (!usuario || !usuario.activo) {
    throw new AppError('Credenciales incorrectas', 401);
  }

  const passwordCorrecta = await bcrypt.compare(
    password,
    usuario.password_hash
  );

  if (!passwordCorrecta) {
    throw new AppError('Credenciales incorrectas', 401);
  }

  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    }
  );

  res.json({
    ok: true,
    mensaje: 'Inicio de sesión exitoso',
    token,
    usuario: {
      ...payload,
      email: usuario.email
    }
  });

});


// ==========================================
// REGISTRAR USUARIO
// POST /api/auth/registrar
// ==========================================

exports.registrar = asyncHandler(async (req, res) => {

  const {
    nombre,
    email,
    password,
    rol = 'vendedor'
  } = req.body;

  // Validar rol
  if (!['admin', 'vendedor'].includes(rol)) {
    throw new AppError('Rol de usuario inválido', 422);
  }

  // Comprobar si el correo ya existe
  const [existentes] = await pool.query(
    'SELECT id FROM usuarios WHERE email = ?',
    [email]
  );

  if (existentes.length > 0) {
    throw new AppError('El correo electrónico ya está registrado', 409);
  }

  // Encriptar contraseña
  const passwordHash = await bcrypt.hash(password, 12);

  // Insertar usuario
  const [resultado] = await pool.query(
    `INSERT INTO usuarios
      (nombre, email, password_hash, rol, activo)
     VALUES (?, ?, ?, ?, 1)`,
    [
      nombre,
      email,
      passwordHash,
      rol
    ]
  );

  res.status(201).json({
    ok: true,
    mensaje: 'Usuario registrado correctamente',
    usuario: {
      id: resultado.insertId,
      nombre,
      email,
      rol
    }
  });

});


// ==========================================
// CONSULTAR PERFIL
// GET /api/auth/perfil
// ==========================================

exports.perfil = asyncHandler(async (req, res) => {

  const [rows] = await pool.query(
    `SELECT id, nombre, email, rol, activo, created_at
     FROM usuarios
     WHERE id = ?
     LIMIT 1`,
    [req.usuario.id]
  );

  const usuario = rows[0];

  if (!usuario || !usuario.activo) {
    throw new AppError('Usuario no encontrado o desactivado', 404);
  }

  res.json({
    ok: true,
    usuario
  });

});
