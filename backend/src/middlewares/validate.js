const { validationResult } = require('express-validator');
const { AppError } = require('../utils/AppError');

module.exports = (req, res, next) => {
  const errores = validationResult(req);
  if (errores.isEmpty()) return next();
  next(new AppError('Datos inválidos', 422, errores.array().map((e) => ({ campo: e.path, mensaje: e.msg }))));
};
