import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
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
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}