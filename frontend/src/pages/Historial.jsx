import { Fragment, useEffect, useState } from 'react'
import { listarVentas, obtenerVenta } from '../services/ventasService'
import { mensajeError } from '../services/api'

const formatoFecha = (valor) =>
  new Date(valor).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })

export default function Historial() {
  const [ventas, setVentas] = useState([])
  const [detalles, setDetalles] = useState({})
  const [abierta, setAbierta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listarVentas()
      .then(setVentas)
      .catch((err) => setError(mensajeError(err, 'No se pudo cargar el historial')))
      .finally(() => setCargando(false))
  }, [])

  const alternar = async (id) => {
    if (abierta === id) return setAbierta(null)
    setAbierta(id)
    if (!detalles[id]) {
      try {
        const venta = await obtenerVenta(id)
        setDetalles((actual) => ({ ...actual, [id]: venta }))
      } catch (err) {
        setError(mensajeError(err, 'No se pudo cargar el detalle de la venta'))
      }
    }
  }

  const totalVendido = ventas.reduce((suma, v) => suma + Number(v.total), 0)

  return (
    <div>
      <h1>Historial de ventas</h1>
      {error && <p className="error">{error}</p>}

      <div className="resumen">
        <span>Ventas registradas: <strong>{ventas.length}</strong></span>
        <span>Total vendido: <strong>S/ {totalVendido.toFixed(2)}</strong></span>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>N.º</th>
            <th>Fecha y hora</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => {
            const detalle = detalles[v.id]
            return (
              <Fragment key={v.id}>
                <tr>
                  <td>{v.id}</td>
                  <td>{formatoFecha(v.fecha)}</td>
                  <td>{v.cliente || '—'}</td>
                  <td>{v.vendedor}</td>
                  <td>S/ {Number(v.total).toFixed(2)}</td>
                  <td>
                    <button className="btn" onClick={() => alternar(v.id)}>
                      {abierta === v.id ? 'Ocultar' : 'Ver detalle'}
                    </button>
                  </td>
                </tr>
                {abierta === v.id && (
                  <tr className="fila-detalle">
                    <td colSpan="6">
                      {!detalle ? (
                        <span className="detalle">Cargando detalle...</span>
                      ) : (
                        <>
                          <table className="sub-tabla">
                            <thead>
                              <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio unitario</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detalle.detalle.map((d) => (
                                <tr key={d.producto_id}>
                                  <td>{d.nombre}</td>
                                  <td>{d.cantidad}</td>
                                  <td>S/ {Number(d.precio_unitario).toFixed(2)}</td>
                                  <td>S/ {Number(d.subtotal).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p className="detalle">
                            Unidades vendidas:{' '}
                            {detalle.detalle.reduce((s, d) => s + d.cantidad, 0)}
                          </p>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
          {!cargando && ventas.length === 0 && (
            <tr>
              <td colSpan="6">Aún no hay ventas registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}