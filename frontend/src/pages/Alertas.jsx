import { useEffect, useState } from 'react'
import { listarAlertas } from '../services/alertasService'
import { mensajeError } from '../services/api'

export default function Alertas() {
  const [alertas, setAlertas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    listarAlertas()
      .then(setAlertas)
      .catch((err) => setError(mensajeError(err, 'No se pudieron cargar las alertas')))
  }, [])

  return (
    <div>
      <h1>Alertas de stock</h1>
      {error && <p className="error">{error}</p>}

      {alertas.length === 0 && !error && (
        <p className="exito">Todos los productos tienen stock suficiente.</p>
      )}

      <div className="alertas-lista">
        {alertas.map((p) => (
          <div key={p.id} className="alerta">
            <div>
              <strong>{p.nombre}</strong>
              <div className="detalle">{p.categoria}</div>
            </div>
            <div className="alerta-datos">
              <span className={p.nivel === 'agotado' ? 'badge agotado' : 'badge bajo'}>
                {p.nivel === 'agotado' ? 'Agotado' : 'Bajo stock'}
              </span>
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