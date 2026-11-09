import { useEffect, useState } from 'react'
import { listarProductos } from '../services/productosService'
import { registrarVenta } from '../services/ventasService'

export default function Ventas() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar los productos'))
  }, [])

  const agregar = (p) => {
    setMensaje('')
    setError('')
    setCarrito((actual) => {
      const existente = actual.find((i) => i.id === p.id)
      if (existente) {
        if (existente.cantidad >= p.stock) return actual
        return actual.map((i) =>
          i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        )
      }
      return [
        ...actual,
        { id: p.id, nombre: p.nombre, precio: Number(p.precio), cantidad: 1, stock: p.stock },
      ]
    })
  }

  const cambiarCantidad = (id, delta) => {
    setCarrito((actual) =>
      actual
        .map((i) =>
          i.id === id ? { ...i, cantidad: Math.min(i.stock, i.cantidad + delta) } : i,
        )
        .filter((i) => i.cantidad > 0),
    )
  }

  const quitar = (id) => setCarrito((actual) => actual.filter((i) => i.id !== id))

  const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  const confirmar = async () => {
    if (carrito.length === 0) return
    setError('')
    try {
      await registrarVenta(carrito)
      setMensaje(`Venta registrada correctamente. Total: S/ ${total.toFixed(2)}`)
      setCarrito([])
      setProductos(await listarProductos())
    } catch {
      setError('No se pudo registrar la venta')
    }
  }

  const filtrados = productos.filter((p) =>
    `${p.nombre} ${p.categoria}`.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div>
      <h1>Ventas</h1>
      {mensaje && <p className="exito">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <div className="ventas-grid">
        <section>
          <input
            className="buscador"
            placeholder="Buscar medicamento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="lista-productos">
            {filtrados.map((p) => (
              <div key={p.id} className="item-producto">
                <div>
                  <strong>{p.nombre}</strong>
                  <div className="detalle">
                    {p.categoria} · S/ {Number(p.precio).toFixed(2)} · Stock: {p.stock}
                  </div>
                </div>
                <button
                  className="btn primario"
                  onClick={() => agregar(p)}
                  disabled={p.stock === 0}
                >
                  {p.stock === 0 ? 'Sin stock' : 'Agregar'}
                </button>
              </div>
            ))}
            {filtrados.length === 0 && <p>No se encontraron productos.</p>}
          </div>
        </section>

        <aside className="card carrito">
          <h2>Carrito</h2>
          {carrito.length === 0 && <p className="detalle">Aún no hay productos.</p>}
          {carrito.map((i) => (
            <div key={i.id} className="linea-carrito">
              <div>
                <strong>{i.nombre}</strong>
                <div className="detalle">
                  S/ {i.precio.toFixed(2)} c/u · Subtotal: S/ {(i.precio * i.cantidad).toFixed(2)}
                </div>
              </div>
              <div className="acciones">
                <button className="btn" onClick={() => cambiarCantidad(i.id, -1)}>−</button>
                <span>{i.cantidad}</span>
                <button className="btn" onClick={() => cambiarCantidad(i.id, 1)}>+</button>
                <button className="btn peligro" onClick={() => quitar(i.id)}>×</button>
              </div>
            </div>
          ))}
          <div className="total">Total: S/ {total.toFixed(2)}</div>
          <button
            className="btn primario grande"
            onClick={confirmar}
            disabled={carrito.length === 0}
          >
            Confirmar venta
          </button>
        </aside>
      </div>
    </div>
  )
}