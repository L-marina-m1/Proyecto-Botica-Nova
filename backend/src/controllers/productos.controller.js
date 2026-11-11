const pool = require('../config/db');
const { AppError, asyncHandler } = require('../utils/AppError');

const BASE = `SELECT p.*, c.nombre AS categoria,
  (p.stock <= p.stock_minimo) AS bajo_stock
  FROM productos p JOIN categorias c ON c.id = p.categoria_id`;

// GET /api/productos?q=para&categoria_id=1&bajo_stock=true
exports.listar = asyncHandler(async (req, res) => {
  const { q, categoria_id, bajo_stock } = req.query;
  const where = ['p.activo = 1'];
  const params = [];
  if (q) { where.push('(p.nombre LIKE ? OR p.descripcion LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
  if (categoria_id) { where.push('p.categoria_id = ?'); params.push(categoria_id); }
  if (bajo_stock === 'true') where.push('p.stock <= p.stock_minimo');
  const [rows] = await pool.query(`${BASE} WHERE ${where.join(' AND ')} ORDER BY p.nombre`, params);
  res.json({ ok: true, total: rows.length, data: rows.map((r) => ({ ...r, bajo_stock: !!r.bajo_stock })) });
});

exports.obtener = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`${BASE} WHERE p.id = ? AND p.activo = 1`, [req.params.id]);
  if (!rows[0]) throw new AppError('Producto no encontrado', 404);
  res.json({ ok: true, data: { ...rows[0], bajo_stock: !!rows[0].bajo_stock } });
});

exports.crear = asyncHandler(async (req, res) => {
  const { nombre, descripcion = null, categoria_id, precio, stock = 0, stock_minimo = 5 } = req.body;
  const [r] = await pool.query(
    'INSERT INTO productos (nombre, descripcion, categoria_id, precio, stock, stock_minimo) VALUES (?,?,?,?,?,?)',
    [nombre, descripcion, categoria_id, precio, stock, stock_minimo]
  );
  res.status(201).json({ ok: true, mensaje: 'Producto registrado', id: r.insertId });
});

exports.actualizar = asyncHandler(async (req, res) => {
  const { nombre, descripcion = null, categoria_id, precio, stock, stock_minimo } = req.body;
  const [r] = await pool.query(
    `UPDATE productos SET nombre=?, descripcion=?, categoria_id=?, precio=?, stock=?, stock_minimo=?
     WHERE id=? AND activo=1`,
    [nombre, descripcion, categoria_id, precio, stock, stock_minimo, req.params.id]
  );
  if (!r.affectedRows) throw new AppError('Producto no encontrado', 404);
  res.json({ ok: true, mensaje: 'Producto actualizado' });
});

// Si el producto ya tiene ventas se desactiva (soft delete) para no perder el historial.
exports.eliminar = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const [[uso]] = await pool.query('SELECT COUNT(*) AS n FROM detalle_ventas WHERE producto_id=?', [id]);
  if (uso.n) {
    const [r] = await pool.query('UPDATE productos SET activo=0 WHERE id=?', [id]);
    if (!r.affectedRows) throw new AppError('Producto no encontrado', 404);
    return res.json({ ok: true, mensaje: 'Producto desactivado (tiene ventas registradas)' });
  }
  const [r] = await pool.query('DELETE FROM productos WHERE id=?', [id]);
  if (!r.affectedRows) throw new AppError('Producto no encontrado', 404);
  res.json({ ok: true, mensaje: 'Producto eliminado' });
});
