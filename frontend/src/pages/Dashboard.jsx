import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarProductos } from '../services/productosService'
import { resumenHoy } from '../services/ventasService'
import { mensajeError } from '../services/api'

export default function Dashboard() {
  const [productos, setProductos] = useState([])
  const [hoy, setHoy] = useState({ cantidad: 0, unidades: 0, total: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([listarProductos(), resumenHoy()])
      .then(([prods, resumen]) => {
        setProductos(prods)
        setHoy(resumen)
      })
      .catch((err) => setError(mensajeError(err, 'No se pudieron cargar los datos')))
  }, [])

  const bajos = productos.filter((p) => p.stock <= p.stock_minimo)
  const unidades = productos.reduce((s, p) => s + Number(p.stock), 0)
  const valor = productos.reduce((s, p) => s + Number(p.precio) * Number(p.stock), 0)
  const fechaHoy = new Date().toLocaleDateString('es-PE', { dateStyle: 'full' })

  return (
    <div>
      <h1>Panel principal</h1>
      <p className="detalle" style={{ marginBottom: 16 }}>{fechaHoy}</p>
      {error && <p className="error">{error}</p>}

      <h2 className="subtitulo">Ventas de hoy</h2>
      <div className="stats stats-hoy">
        <div className="stat">
          <span className="stat-num">{hoy.cantidad}</span>
          <span>Ventas realizadas</span>
        </div>
        <div className="stat">
          <span className="stat-num">{hoy.unidades}</span>
          <span>Unidades vendidas</span>
        </div>
        <div className="stat">
          <span className="stat-num">S/ {Number(hoy.total).toFixed(2)}</span>
          <span>Ingresos del día</span>
        </div>
      </div>

      <h2 className="subtitulo">Inventario</h2>
      <div className="stats">
        <div className="stat">
          <span className="stat-num">{productos.length}</span>
          <span>Productos activos</span>
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