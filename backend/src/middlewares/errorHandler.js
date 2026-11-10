function notFound(req, res) {
  res.status(404).json({ ok: false, mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  let status = err.status || 500;
  let mensaje = err.message;
  if (err.code === 'ER_DUP_ENTRY') { status = 409; mensaje = 'Registro duplicado'; }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') { status = 400; mensaje = 'Referencia inválida (categoría/producto no existe)'; }
  if (status === 500) { console.error(err); mensaje = 'Error interno del servidor'; }
  res.status(status).json({ ok: false, mensaje, detalles: err.detalles });
}

module.exports = { notFound, errorHandler };
