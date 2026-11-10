import { Navigate, Outlet } from 'react-router-dom'
import { obtenerSesion } from '../services/authService'

export default function RutaProtegida({ roles }) {
  const sesion = obtenerSesion()

  if (!sesion) return <Navigate to="/login" replace />
  if (roles && !roles.includes(sesion.usuario?.rol)) return <Navigate to="/ventas" replace />

  return <Outlet />
}