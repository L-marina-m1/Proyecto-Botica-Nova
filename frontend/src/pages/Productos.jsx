import { useEffect, useState } from 'react'
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../services/productosService'

const vacio = { nombre: '', categoria: '', precio: '', stock: '', stock_minimo: '' }

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState(vacio)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar los productos'))
  }, [])

  const recargar = async () => setProductos(await listarProductos())

  const manejarCambio = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    const datos = {
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      stock_minimo: Number(form.stock_minimo),
    }
    if (!datos.nombre) return setError('El nombre es obligatorio')
    if ([datos.precio, datos.stock, datos.stock_minimo].some((n) => Number.isNaN(n) || n < 0)) {
      return setError('Precio y stock deben ser números válidos')
    }
    try {
      if (editandoId) await actualizarProducto(editandoId, datos)
      else await crearProducto(datos)
      setForm(vacio)
      setEditandoId(null)
      await recargar()
    } catch {
      setError('No se pudo guardar el producto')
    }
  }

  const editar = (p) => {
    setEditandoId(p.id)
    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
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

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return
    try {
      await eliminarProducto(p.id)
      await recargar()
    } catch {
      setError('No se pudo eliminar el producto')
    }
  }

  const filtrados = productos.filter((p) =>
    `${p.nombre} ${p.categoria}`.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div>
      <h1>Productos</h1>

      <form className="card form-grid" onSubmit={guardar}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambio} required />
        <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={manejarCambio} required />
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
        {error && <p className="error">{error}</p>}
      </form>

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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((p) => {
            const bajo = p.stock <= p.stock_minimo
            return (
              <tr key={p.id} className={bajo ? 'fila-bajo' : ''}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>S/ {Number(p.precio).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={bajo ? 'badge bajo' : 'badge ok'}>
                    {bajo ? 'Bajo stock' : 'Normal'}
                  </span>
                </td>
                <td className="acciones">
                  <button className="btn" onClick={() => editar(p)}>Editar</button>
                  <button className="btn peligro" onClick={() => eliminar(p)}>Eliminar</button>
                </td>
              </tr>
            )
          })}
          {filtrados.length === 0 && (
            <tr>
              <td colSpan="6">No se encontraron productos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}