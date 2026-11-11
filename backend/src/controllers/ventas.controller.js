const pool = require('../config/db');
const { AppError, asyncHandler } = require('../utils/AppError');

// POST /api/ventas  { cliente?, items: [{ producto_id, cantidad }] }
exports.registrar = asyncHandler(async (req, res) => {
  const { cliente = null, items } = req.body;

  // Unir productos repetidos y ordenar por id (evita deadlocks)
  const mapa = new Map();
  items.forEach((i) => mapa.set(i.producto_id, (mapa.get(i.producto_id) || 0) + i.cantidad));
  const lineas = [...mapa.entries()].sort((a, b) => a[0] - b[0]);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [v] = await conn.query('INSERT INTO ventas (usuario_id, cliente, total) VALUES (?,?,0)', [req.usuario.id, cliente]);
    const ventaId = v.insertId;
    let total = 0;
    const alertas = [];

    for (const [productoId, cantidad] of lineas) {
      // FOR UPDATE bloquea la fila: dos ventas simultáneas no pueden vender el mismo stock
      const [[p]] = await conn.query('SELECT * FROM productos WHERE id=? AND activo=1 FOR UPDATE', [productoId]);
      if (!p) throw new AppError(`Producto ${productoId} no existe`, 404);
      if (p.stock < cantidad) {
        throw new AppError(`Stock insuficiente de "${p.nombre}" (disponible: ${p.stock})`, 409);
      }
      const subtotal = +(p.precio * cantidad).toFixed(2);
      total += subtotal;

      await conn.query(
        'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?,?,?,?,?)',
        [ventaId, productoId, cantidad, p.precio, subtotal]
      );
      await conn.query('UPDATE productos SET stock = stock - ? WHERE id=?', [cantidad, productoId]);

      const nuevoStock = p.stock - cantidad;
      if (nuevoStock <= p.stock_minimo) {
        alertas.push({ producto_id: p.id, nombre: p.nombre, stock: nuevoStock, stock_minimo: p.stock_minimo });
      }
    }

    total = +total.toFixed(2);
    await conn.query('UPDATE ventas SET total=? WHERE id=?', [total, ventaId]);
    await conn.commit();

    res.status(201).json({ ok: true, mensaje: 'Venta registrada', venta: { id: ventaId, total, cliente }, alertas });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

exports.listar = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT v.id, v.fecha, v.cliente, v.total, u.nombre AS vendedor
     FROM ventas v JOIN usuarios u ON u.id = v.usuario_id ORDER BY v.fecha DESC LIMIT 200`
  );
  res.json({ ok: true, total: rows.length, data: rows });
});

exports.obtener = asyncHandler(async (req, res) => {
  const [[venta]] = await pool.query(
    `SELECT v.id, v.fecha, v.cliente, v.total, u.nombre AS vendedor
     FROM ventas v JOIN usuarios u ON u.id = v.usuario_id WHERE v.id=?`, [req.params.id]);
  if (!venta) throw new AppError('Venta no encontrada', 404);
  const [detalle] = await pool.query(
    `SELECT d.producto_id, p.nombre, d.cantidad, d.precio_unitario, d.subtotal
     FROM detalle_ventas d JOIN productos p ON p.id = d.producto_id WHERE d.venta_id=?`, [req.params.id]);
  res.json({ ok: true, data: { ...venta, detalle } });
});


// GET /api/ventas/resumen/hoy  (solo administrador)
exports.resumenHoy = asyncHandler(async (req, res) => {
  const [[ventas]] = await pool.query(
    `SELECT COUNT(*) AS cantidad, COALESCE(SUM(total), 0) AS total
     FROM ventas
     WHERE fecha >= CURDATE() AND fecha < CURDATE() + INTERVAL 1 DAY`
  );
  const [[unidades]] = await pool.query(
    `SELECT COALESCE(SUM(d.cantidad), 0) AS unidades
     FROM detalle_ventas d
     JOIN ventas v ON v.id = d.venta_id
     WHERE v.fecha >= CURDATE() AND v.fecha < CURDATE() + INTERVAL 1 DAY`
  );

  res.json({
    ok: true,
    data: {
      cantidad: Number(ventas.cantidad),
      unidades: Number(unidades.unidades),
      total: Number(ventas.total)
    }
  });
});