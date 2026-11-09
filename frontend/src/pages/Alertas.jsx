import { useEffect, useState } from 'react'
import { listarProductos } from '../services/productosService'

export default function Alertas() {
  const [productos, setProductos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar las alertas'))
  }, [])

  const bajos = productos
    .filter((p) => p.stock <= p.stock_minimo)
    .sort((a, b) => a.stock - b.stock)

  return (
    <div>
      <h1>Alertas de stock</h1>
      {error && <p className="error">{error}</p>}

      {bajos.length === 0 && !error && (
        <p className="exito">Todos los productos tienen stock suficiente.</p>
      )}

      <div className="alertas-lista">
        {bajos.map((p) => (
          <div key={p.id} className="alerta">
            <div>
              <strong>{p.nombre}</strong>
              <div className="detalle">{p.categoria}</div>
            </div>
            <div className="alerta-datos">
              <span>Stock actual: <strong>{p.stock}</strong></span>
              <span>Mínimo: <strong>{p.stock_minimo}</strong></span>
              <span>
                Faltan para el mínimo:{' '}
                <strong>{Math.max(0, p.stock_minimo - p.stock)}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}