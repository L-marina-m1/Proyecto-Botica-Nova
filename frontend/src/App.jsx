import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Ventas from './pages/Ventas'
import Historial from './pages/Historial'
import Alertas from './pages/Alertas'
import Usuarios from './pages/Usuarios'
import Login from './pages/Login'
import { esAdmin } from './services/authService'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={esAdmin() ? <Dashboard /> : <Navigate to="/ventas" replace />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route element={<RutaProtegida roles={['admin']} />}>
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}