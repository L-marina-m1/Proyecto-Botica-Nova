function notFound(req, res) {
  res.status(404).json({
    ok: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let mensaje = err.message || 'Error interno del servidor';

  let detalles = err.detalles;

  // Registro duplicado
  if (err.code === 'ER_DUP_ENTRY') {
    status = 409;
    mensaje = 'El registro ya existe o está duplicado';
  }

  // Referencia inexistente
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    status = 400;
    mensaje = 'Referencia inválida: el registro relacionado no existe';
  }

  // No se puede eliminar un registro relacionado
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    status = 409;
    mensaje = 'No se puede eliminar porque existen registros relacionados';
  }

  // Error de conexión MySQL
  if (
    err.code === 'ECONNREFUSED' ||
    err.code === 'PROTOCOL_CONNECTION_LOST'
  ) {
    status = 503;
    mensaje = 'No se pudo establecer conexión con la base de datos';
  }

  // Errores internos
  if (status >= 500) {
    console.error('Error interno:', err);

    mensaje = 'Error interno del servidor';
    detalles = undefined;
  }

  res.status(status).json({
    ok: false,
    mensaje,
    ...(detalles ? { detalles } : {})
  });
}

module.exports = {
  notFound,
  errorHandler
};
