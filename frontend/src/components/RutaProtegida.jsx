import { Navigate, Outlet } from 'react-router-dom'
import { obtenerSesion } from '../services/authService'

export default function RutaProtegida() {
  return obtenerSesion() ? <Outlet /> : <Navigate to="/login" replace />
}