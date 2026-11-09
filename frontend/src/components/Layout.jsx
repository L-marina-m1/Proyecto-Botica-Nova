import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { obtenerSesion, cerrarSesion } from '../services/authService'

export default function Layout() {
  const navigate = useNavigate()
  const sesion = obtenerSesion()

  const salir = () => {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Nova Salud</h2>
        <nav>
          <NavLink to="/" end>Panel principal</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/ventas">Ventas</NavLink>
          <NavLink to="/alertas">Alertas de stock</NavLink>
        </nav>
        <div className="sidebar-pie">
          <span>{sesion?.usuario?.nombre}</span>
          <button className="btn" onClick={salir}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}