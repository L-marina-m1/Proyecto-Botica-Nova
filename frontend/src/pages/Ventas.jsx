import { useEffect, useState } from 'react'
import { listarProductos } from '../services/productosService'
import {
  registrarVenta,
  obtenerVenta,
} from '../services/ventasService'
import {
  generarBoletaPDF,
  abrirBoletaPDF,
} from '../services/boletaService'
import { mensajeError } from '../services/api'

export default function Ventas() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState([])
  const [cliente, setCliente] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [avisos, setAvisos] = useState([])
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch((err) =>
        setError(mensajeError(err, 'No se pudieron cargar los productos')),
      )
  }, [])

  const agregar = (p) => {
    setMensaje('')
    setAvisos([])
    setError('')

    setCarrito((actual) => {
      const existente = actual.find((i) => i.id === p.id)

      if (existente) {
        if (existente.cantidad >= p.stock) return actual

        return actual.map((i) =>
          i.id === p.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i,
        )
      }

      return [
        ...actual,
        {
          id: p.id,
          nombre: p.nombre,
          precio: Number(p.precio),
          cantidad: 1,
          stock: p.stock,
        },
      ]
    })
  }

  const cambiarCantidad = (id, delta) => {
    setCarrito((actual) =>
      actual
        .map((i) =>
          i.id === id
            ? {
                ...i,
                cantidad: Math.min(i.stock, i.cantidad + delta),
              }
            : i,
        )
        .filter((i) => i.cantidad > 0),
    )
  }

  const quitar = (id) => {
    setCarrito((actual) => actual.filter((i) => i.id !== id))
  }

  const total = carrito.reduce(
    (suma, i) => suma + i.precio * i.cantidad,
    0,
  )

  // Confirmar venta y generar boleta PDF
  const confirmar = async () => {
    if (carrito.length === 0 || procesando) return

    setError('')
    setMensaje('')
    setAvisos([])
    setProcesando(true)

    // Abrir la pestaña inmediatamente para evitar bloqueos del navegador
    const ventana = window.open('', '_blank')

    if (ventana) {
      ventana.document.write(`
        <html>
          <head>
            <title>Nova Salud - Generando boleta</title>
          </head>
          <body style="
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 90vh;
            color: #184169;
          ">
            <h2>Nova Salud - Generando boleta...</h2>
          </body>
        </html>
      `)

      ventana.document.close()
    }

    try {
      // 1. Registrar venta en el backend
      const res = await registrarVenta(carrito, cliente.trim())

      // 2. Recuperar los datos completos de la venta
      const venta = await obtenerVenta(res.venta.id)

      // 3. Generar el documento PDF
      const pdfUrl = await generarBoletaPDF(venta)

      // 4. Abrir el PDF en el navegador
      abrirBoletaPDF(ventana, pdfUrl)

      // 5. Mostrar confirmación
      setMensaje(
        `Venta registrada correctamente. Total: S/ ${Number(
          res.venta.total,
        ).toFixed(2)}. Boleta generada correctamente.`,
      )

      setAvisos(res.alertas || [])

      // 6. Limpiar carrito y cliente
      setCarrito([])
      setCliente('')

      // 7. Actualizar productos y stock
      try {
        const productosActualizados = await listarProductos()
        setProductos(productosActualizados)
      } catch {
        setError(
          'La venta se registró correctamente, pero no se pudo actualizar el listado de productos.',
        )
      }
    } catch (err) {
      // Si el registro falla, cerrar la pestaña vacía
      if (ventana && !ventana.closed) {
        ventana.close()
      }

      setError(
        mensajeError(
          err,
          'No se pudo completar la venta o generar su boleta.',
        ),
      )
    } finally {
      setProcesando(false)
    }
  }

  const filtrados = productos.filter((p) =>
    `${p.nombre} ${p.categoria}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  )

  return (
    <div>
      <h1>Ventas</h1>

      {mensaje && <p className="exito">{mensaje}</p>}

      {avisos.length > 0 && (
        <div className="aviso">
          <strong>Reposición necesaria:</strong>

          <ul>
            {avisos.map((a) => (
              <li key={a.producto_id}>
                {a.nombre}: quedan {a.stock} (mínimo {a.stock_minimo})
              </li>
            ))}
          </ul>
        </div>
      )}

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
                    {p.categoria} · S/ {Number(p.precio).toFixed(2)} · Stock:{' '}
                    {p.stock}
                  </div>
                </div>

                <button
                  className="btn primario"
                  onClick={() => agregar(p)}
                  disabled={p.stock === 0 || procesando}
                >
                  {p.stock === 0 ? 'Sin stock' : 'Agregar'}
                </button>
              </div>
            ))}

            {filtrados.length === 0 && (
              <p>No se encontraron productos.</p>
            )}
          </div>
        </section>

        <aside className="card carrito">
          <h2>Carrito</h2>

          <input
            placeholder="Cliente (opcional)"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            maxLength={120}
            disabled={procesando}
          />

          {carrito.length === 0 && (
            <p className="detalle">Aún no hay productos.</p>
          )}

          {carrito.map((i) => (
            <div key={i.id} className="linea-carrito">
              <div>
                <strong>{i.nombre}</strong>

                <div className="detalle">
                  S/ {i.precio.toFixed(2)} c/u · Subtotal: S/{' '}
                  {(i.precio * i.cantidad).toFixed(2)}
                </div>
              </div>

              <div className="acciones">
                <button
                  className="btn"
                  onClick={() => cambiarCantidad(i.id, -1)}
                  disabled={procesando}
                >
                  −
                </button>

                <span>{i.cantidad}</span>

                <button
                  className="btn"
                  onClick={() => cambiarCantidad(i.id, 1)}
                  disabled={procesando || i.cantidad >= i.stock}
                >
                  +
                </button>

                <button
                  className="btn peligro"
                  onClick={() => quitar(i.id)}
                  disabled={procesando}
                >
                  ×
                </button>
              </div>
            </div>
          ))}

          <div className="total">
            Total: S/ {total.toFixed(2)}
          </div>

          <button
            className="btn primario grande"
            onClick={confirmar}
            disabled={carrito.length === 0 || procesando}
          >
            {procesando ? 'Procesando venta...' : 'Confirmar venta'}
          </button>
        </aside>
      </div>
    </div>
  )
}
