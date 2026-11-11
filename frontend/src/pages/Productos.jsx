import { useEffect, useState } from 'react'
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto,
  eliminarProducto,
} from '../services/productosService'
import { listarCategorias } from '../services/categoriasService'
import { esAdmin } from '../services/authService'
import { mensajeError } from '../services/api'

const vacio = {
  nombre: '',
  descripcion: '',
  categoria_id: '',
  precio: '',
  stock: '',
  stock_minimo: '',
}

export default function Productos() {
  const admin = esAdmin()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState(vacio)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    Promise.all([listarProductos({ todos: admin }), listarCategorias()])
      .then(([prods, cats]) => {
        setProductos(prods)
        setCategorias(cats)
      })
      .catch((err) => setError(mensajeError(err, 'No se pudieron cargar los productos')))
  }, [admin])

  const recargar = async () => setProductos(await listarProductos({ todos: admin }))

  const manejarCambio = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      categoria_id: Number(form.categoria_id),
      precio: Number(form.precio),
      stock: Number(form.stock),
      stock_minimo: Number(form.stock_minimo),
    }
    if (!datos.nombre) return setError('El nombre es obligatorio')
    if (!datos.categoria_id) return setError('Selecciona una categoría')
    if ([datos.precio, datos.stock, datos.stock_minimo].some((n) => Number.isNaN(n) || n < 0)) {
      return setError('Precio y stock deben ser números válidos')
    }
    try {
      if (editandoId) await actualizarProducto(editandoId, datos)
      else await crearProducto(datos)
      setMensaje(editandoId ? 'Producto actualizado correctamente' : 'Producto registrado correctamente')
      setForm(vacio)
      setEditandoId(null)
      await recargar()
    } catch (err) {
      setError(mensajeError(err, 'No se pudo guardar el producto'))
    }
  }

  const editar = (p) => {
    setEditandoId(p.id)
    setMensaje('')
    setError('')
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      categoria_id: String(p.categoria_id),
      precio: String(p.precio),
      stock: String(p.stock),
      stock_minimo: String(p.stock_minimo),
    })
  }

  const cancelar = () => {
    setEditandoId(null)
    setForm(vacio)
    setError('')
  }

  const alternarEstado = async (p) => {
    setError('')
    setMensaje('')
    try {
      await cambiarEstadoProducto(p.id, !p.activo)
      setMensaje(p.activo ? `"${p.nombre}" fue deshabilitado` : `"${p.nombre}" fue habilitado`)
      await recargar()
    } catch (err) {
      setError(mensajeError(err, 'No se pudo cambiar el estado del producto'))
    }
  }

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return
    setError('')
    setMensaje('')
    try {
      setMensaje(await eliminarProducto(p.id))
      await recargar()
    } catch (err) {
      setError(mensajeError(err, 'No se pudo eliminar el producto'))
    }
  }

  const filtrados = productos.filter((p) =>
    `${p.nombre} ${p.categoria}`.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div>
      <h1>Productos</h1>

      {mensaje && <p className="exito">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      {admin ? (
        <form className="card form-grid" onSubmit={guardar}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambio} required />
          <input name="descripcion" placeholder="Descripción (opcional)" value={form.descripcion} onChange={manejarCambio} />
          <select name="categoria_id" value={form.categoria_id} onChange={manejarCambio} required>
            <option value="">Selecciona categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input name="precio" type="number" step="0.01" min="0" placeholder="Precio" value={form.precio} onChange={manejarCambio} required />
          <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={manejarCambio} required />
          <input name="stock_minimo" type="number" min="0" placeholder="Stock mínimo" value={form.stock_minimo} onChange={manejarCambio} required />
          <div className="acciones">
            <button type="submit" className="btn primario">
              {editandoId ? 'Guardar cambios' : 'Registrar producto'}
            </button>
            {editandoId && (
              <button type="button" className="btn" onClick={cancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="detalle" style={{ marginBottom: 16 }}>
          Solo el administrador puede registrar, editar o deshabilitar productos.
        </p>
      )}

      <input
        className="buscador"
        placeholder="Buscar por nombre o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            {admin && <th></th>}
          </tr>
        </thead>
        <tbody>
          {filtrados.map((p) => {
            const bajo = p.stock <= p.stock_minimo
            const clase = !p.activo ? 'fila-inactiva' : bajo ? 'fila-bajo' : ''
            return (
              <tr key={p.id} className={clase}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>S/ {Number(p.precio).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  {!p.activo ? (
                    <span className="badge inactivo">Deshabilitado</span>
                  ) : (
                    <span className={bajo ? 'badge bajo' : 'badge ok'}>
                      {bajo ? 'Bajo stock' : 'Normal'}
                    </span>
                  )}
                </td>
                {admin && (
                  <td className="acciones">
                    <button className="btn" onClick={() => editar(p)}>Editar</button>
                    <button className="btn" onClick={() => alternarEstado(p)}>
                      {p.activo ? 'Deshabilitar' : 'Habilitar'}
                    </button>
                    <button className="btn peligro" onClick={() => eliminar(p)}>Eliminar</button>
                  </td>
                )}
              </tr>
            )
          })}
          {filtrados.length === 0 && (
            <tr>
              <td colSpan={admin ? 6 : 5}>No se encontraron productos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}