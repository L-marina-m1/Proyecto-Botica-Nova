const pool = require('../config/db');
const { asyncHandler } = require('../utils/AppError');

// GET /api/alertas/bajo-stock
exports.bajoStock = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.nombre, c.nombre AS categoria, p.stock, p.stock_minimo,
            IF(p.stock = 0, 'agotado', 'bajo') AS nivel
     FROM productos p JOIN categorias c ON c.id = p.categoria_id
     WHERE p.activo = 1 AND p.stock <= p.stock_minimo
     ORDER BY p.stock ASC, p.nombre`
  );
  res.json({ ok: true, total: rows.length, data: rows });
});
