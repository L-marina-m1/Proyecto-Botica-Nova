import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { obtenerSesion, cerrarSesion, esAdmin, etiquetaRol } from '../services/authService'
import Bienvenida from './Bienvenida'
import logo from '../assets/logo.png'

function IconoUsuario() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()
  const sesion = obtenerSesion()
  const admin = esAdmin()

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
          {admin && <NavLink to="/" end>Panel principal</NavLink>}
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/ventas">Ventas</NavLink>
          <NavLink to="/historial">Historial de ventas</NavLink>
          <NavLink to="/alertas">Alertas de stock</NavLink>
          {admin && <NavLink to="/usuarios">Usuarios</NavLink>}
        </nav>

        <div className="sidebar-pie">
          <div className="usuario-caja">
            <span className="avatar"><IconoUsuario /></span>
            <div>
              <div className="usuario-nombre">{sesion?.usuario?.nombre}</div>
              <div className="usuario-rol">{etiquetaRol(sesion?.usuario?.rol)}</div>
            </div>
          </div>
          <button className="btn" onClick={salir}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="content">
        <Bienvenida />
        <Outlet />
      </main>
    </div>
  )
}