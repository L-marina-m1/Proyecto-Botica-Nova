const pool = require('../config/db');
const { AppError, asyncHandler } = require('../utils/AppError');

exports.listar = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nombre');
  res.json({ ok: true, data: rows });
});

exports.crear = asyncHandler(async (req, res) => {
  const { nombre, descripcion = null } = req.body;
  const [r] = await pool.query('INSERT INTO categorias (nombre, descripcion) VALUES (?,?)', [nombre, descripcion]);
  res.status(201).json({ ok: true, data: { id: r.insertId, nombre, descripcion } });
});

exports.actualizar = asyncHandler(async (req, res) => {
  const { nombre, descripcion = null } = req.body;
  const [r] = await pool.query('UPDATE categorias SET nombre=?, descripcion=? WHERE id=?', [nombre, descripcion, req.params.id]);
  if (!r.affectedRows) throw new AppError('Categoría no encontrada', 404);
  res.json({ ok: true, mensaje: 'Categoría actualizada' });
});

exports.eliminar = asyncHandler(async (req, res) => {
  const [[uso]] = await pool.query('SELECT COUNT(*) AS n FROM productos WHERE categoria_id=?', [req.params.id]);
  if (uso.n) throw new AppError('No se puede eliminar: tiene productos asociados', 409);
  const [r] = await pool.query('DELETE FROM categorias WHERE id=?', [req.params.id]);
  if (!r.affectedRows) throw new AppError('Categoría no encontrada', 404);
  res.json({ ok: true, mensaje: 'Categoría eliminada' });
});
