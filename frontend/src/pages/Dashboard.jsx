import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarProductos } from '../services/productosService'

export default function Dashboard() {
  const [productos, setProductos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar los datos'))
  }, [])

  const bajos = productos.filter((p) => p.stock <= p.stock_minimo)
  const unidades = productos.reduce((s, p) => s + Number(p.stock), 0)
  const valor = productos.reduce((s, p) => s + Number(p.precio) * Number(p.stock), 0)

  return (
    <div>
      <h1>Panel principal</h1>
      {error && <p className="error">{error}</p>}

      <div className="stats">
        <div className="stat">
          <span className="stat-num">{productos.length}</span>
          <span>Productos registrados</span>
        </div>
        <div className="stat">
          <span className="stat-num">{unidades}</span>
          <span>Unidades en inventario</span>
        </div>
        <div className="stat">
          <span className="stat-num">S/ {valor.toFixed(2)}</span>
          <span>Valor del inventario</span>
        </div>
        <div className={bajos.length > 0 ? 'stat stat-alerta' : 'stat'}>
          <span className="stat-num">{bajos.length}</span>
          <span>Productos con bajo stock</span>
        </div>
      </div>

      <div className="card">
        <h2>Requieren reposición</h2>
        {bajos.length === 0 && <p className="detalle">No hay alertas por ahora.</p>}
        <ul className="lista-simple">
          {bajos.slice(0, 5).map((p) => (
            <li key={p.id}>
              {p.nombre} <span className="badge bajo">{p.stock} / mín. {p.stock_minimo}</span>
            </li>
          ))}
        </ul>
        {bajos.length > 0 && <Link to="/alertas">Ver todas las alertas</Link>}
      </div>
    </div>
  )
}