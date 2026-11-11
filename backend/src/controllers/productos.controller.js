const pool = require('../config/db');

const {
  AppError,
  asyncHandler
} = require('../utils/AppError');

// ==========================================
// CONSULTA BASE
// ==========================================

const BASE = `
  SELECT
    p.*,
    c.nombre AS categoria,
    (p.stock <= p.stock_minimo) AS bajo_stock
  FROM productos p
  INNER JOIN categorias c ON c.id = p.categoria_id
`;


// ==========================================
// LISTAR PRODUCTOS
// GET /api/productos
// ==========================================

exports.listar = asyncHandler(async (req, res) => {

  const { q, categoria_id, bajo_stock, todos } = req.query;

  const condiciones = [];
  const parametros = [];

  // Solo el administrador puede ver también los productos deshabilitados
  const incluirInactivos = todos === 'true' && req.usuario?.rol === 'admin';
  if (!incluirInactivos) {
    condiciones.push('p.activo = 1');
  }

  // Buscar por nombre o descripción
  if (q && q.trim()) {
    condiciones.push('(p.nombre LIKE ? OR p.descripcion LIKE ?)');
    const busqueda = `%${q.trim()}%`;
    parametros.push(busqueda, busqueda);
  }

  // Filtrar por categoría
  if (categoria_id) {
    if (!/^\d+$/.test(categoria_id) || Number(categoria_id) < 1) {
      throw new AppError('Categoría inválida', 422);
    }
    condiciones.push('p.categoria_id = ?');
    parametros.push(Number(categoria_id));
  }

  // Filtrar productos con bajo stock
  if (bajo_stock === 'true') {
    condiciones.push('p.stock <= p.stock_minimo');
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `${BASE} ${where} ORDER BY p.nombre ASC`,
    parametros
  );

  res.json({
    ok: true,
    total: rows.length,
    data: rows.map((producto) => ({
      ...producto,
      bajo_stock: Boolean(producto.bajo_stock),
      activo: Boolean(producto.activo)
    }))
  });

});


// ==========================================
// OBTENER PRODUCTO
// GET /api/productos/:id
// ==========================================

exports.obtener = asyncHandler(async (req, res) => {

  const [rows] = await pool.query(
    `${BASE}
     WHERE p.id = ?
     AND p.activo = 1`,
    [req.params.id]
  );

  if (!rows.length) {
    throw new AppError('Producto no encontrado', 404);
  }

  const producto = rows[0];

  res.json({
    ok: true,
    data: {
      ...producto,
      bajo_stock: Boolean(producto.bajo_stock)
    }
  });

});


// ==========================================
// CREAR PRODUCTO
// POST /api/productos
// ==========================================

exports.crear = asyncHandler(async (req, res) => {

  const {
    nombre,
    descripcion = null,
    categoria_id,
    precio,
    stock = 0,
    stock_minimo = 5
  } = req.body;

  const [resultado] = await pool.query(
    `INSERT INTO productos
      (
        nombre,
        descripcion,
        categoria_id,
        precio,
        stock,
        stock_minimo
      )
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      descripcion,
      categoria_id,
      precio,
      stock,
      stock_minimo
    ]
  );

  res.status(201).json({
    ok: true,
    mensaje: 'Producto registrado correctamente',
    id: resultado.insertId
  });

});


// ==========================================
// ACTUALIZAR PRODUCTO
// PUT /api/productos/:id
// ==========================================

exports.actualizar = asyncHandler(async (req, res) => {

  const id = req.params.id;

  const {
    nombre,
    descripcion,
    categoria_id,
    precio,
    stock,
    stock_minimo
  } = req.body;

  // Verificar existencia
  const [productos] = await pool.query(
    `SELECT id
     FROM productos
     WHERE id = ? AND activo = 1`,
    [id]
  );

  if (!productos.length) {
    throw new AppError('Producto no encontrado', 404);
  }

  // Actualizar únicamente los campos enviados
  const campos = [];
  const valores = [];

  if (nombre !== undefined) {
    campos.push('nombre = ?');
    valores.push(nombre);
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'descripcion')) {
    campos.push('descripcion = ?');
    valores.push(descripcion);
  }

  if (categoria_id !== undefined) {
    campos.push('categoria_id = ?');
    valores.push(categoria_id);
  }

  if (precio !== undefined) {
    campos.push('precio = ?');
    valores.push(precio);
  }

  if (stock !== undefined) {
    campos.push('stock = ?');
    valores.push(stock);
  }

  if (stock_minimo !== undefined) {
    campos.push('stock_minimo = ?');
    valores.push(stock_minimo);
  }

  if (!campos.length) {
    throw new AppError('No se enviaron datos para actualizar', 400);
  }

  valores.push(id);

  await pool.query(
    `UPDATE productos
     SET ${campos.join(', ')}
     WHERE id = ? AND activo = 1`,
    valores
  );

  res.json({
    ok: true,
    mensaje: 'Producto actualizado correctamente'
  });

});


// ==========================================
// ELIMINAR PRODUCTO
// DELETE /api/productos/:id
// ==========================================

exports.eliminar = asyncHandler(async (req, res) => {

  const id = req.params.id;

  // Verificar existencia
  const [productos] = await pool.query(
    `SELECT id
     FROM productos
     WHERE id = ? AND activo = 1`,
    [id]
  );

  if (!productos.length) {
    throw new AppError('Producto no encontrado', 404);
  }

  // Comprobar si tiene ventas asociadas
  const [[uso]] = await pool.query(
    `SELECT COUNT(*) AS cantidad
     FROM detalle_ventas
     WHERE producto_id = ?`,
    [id]
  );

  if (uso.cantidad > 0) {

    // Desactivar sin perder historial
    await pool.query(
      `UPDATE productos
       SET activo = 0
       WHERE id = ?`,
      [id]
    );

    return res.json({
      ok: true,
      mensaje: 'Producto desactivado correctamente porque tiene ventas registradas'
    });

  }

  // Si no tiene ventas, eliminar definitivamente
  await pool.query(
    'DELETE FROM productos WHERE id = ?',
    [id]
  );

  res.json({
    ok: true,
    mensaje: 'Producto eliminado correctamente'
  });

});


// PATCH /api/productos/:id/estado  { activo: true | false }
exports.cambiarEstado = asyncHandler(async (req, res) => {
  const { activo } = req.body;

  const [productos] = await pool.query('SELECT id FROM productos WHERE id = ?', [req.params.id]);
  if (!productos.length) {
    throw new AppError('Producto no encontrado', 404);
  }

  await pool.query('UPDATE productos SET activo = ? WHERE id = ?', [activo ? 1 : 0, req.params.id]);

  res.json({
    ok: true,
    mensaje: activo ? 'Producto habilitado correctamente' : 'Producto deshabilitado correctamente'
  });
});