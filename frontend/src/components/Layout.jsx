import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { obtenerSesion, cerrarSesion } from '../services/authService'
import logo from '../assets/logo.png'

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()
  const sesion = obtenerSesion()

  const cerrarMenu = () => setMenuAbierto(false)

  const salir = () => {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="btn-menu" onClick={() => setMenuAbierto(true)} aria-label="Abrir menú">
          ☰
        </button>
        <img src={logo} alt="" className="topbar-logo" />
        <span>Nova Salud</span>
      </header>

      {menuAbierto && <div className="overlay" onClick={cerrarMenu} />}

      <aside className={menuAbierto ? 'sidebar abierto' : 'sidebar'}>
        <div className="marca">
          <div className="logo-caja">
            <img src={logo} alt="Logo Nova Salud" />
          </div>
          <h2>Nova Salud</h2>
        </div>
        <nav onClick={cerrarMenu}>
          <NavLink to="/" end>Panel principal</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/ventas">Ventas</NavLink>
          <NavLink to="/historial">Historial de ventas</NavLink>
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