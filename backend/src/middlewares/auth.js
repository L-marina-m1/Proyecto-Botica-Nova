const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/AppError');

function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');
  if (tipo !== 'Bearer' || !token) return next(new AppError('Token requerido', 401));
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
}

const soloRoles = (...roles) => (req, res, next) =>
  roles.includes(req.usuario?.rol) ? next() : next(new AppError('No tienes permisos', 403));

module.exports = { verificarToken, soloRoles };
