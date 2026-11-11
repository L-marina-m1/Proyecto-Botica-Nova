const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { AppError } = require('../utils/AppError');

async function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(new AppError('Token requerido', 401));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError('Token inválido o expirado', 401));
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, rol, activo FROM usuarios WHERE id = ? LIMIT 1',
      [payload.id]
    );
    const usuario = rows[0];

    if (!usuario || !usuario.activo) {
      return next(new AppError('Usuario desactivado o inexistente', 401));
    }

    req.usuario = { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
    next();
  } catch (error) {
    next(error);
  }
}

const soloRoles = (...roles) => (req, res, next) => {
  if (roles.includes(req.usuario?.rol)) {
    return next();
  }

  next(new AppError('No tienes permisos', 403));
};

module.exports = {
  verificarToken,
  soloRoles
};