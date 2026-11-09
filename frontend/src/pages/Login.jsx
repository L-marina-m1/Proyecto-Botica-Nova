import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { iniciarSesion } from '../services/authService'
import logo from '../assets/logo.png'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await iniciarSesion(usuario.trim(), clave)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'No se pudo iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-fondo">
      <form className="login-caja" onSubmit={enviar}>
        <img src={logo} alt="Logo Nova Salud" className="login-logo" />
        <h1>Nova Salud</h1>
        <p className="detalle">Sistema de inventario y ventas</p>

        <label>Usuario</label>
        <input value={usuario} onChange={(e) => setUsuario(e.target.value)} required autoFocus />

        <label>Contraseña</label>
        <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />

        {error && <p className="error">{error}</p>}

        <button className="btn primario grande" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
        <p className="detalle">Datos de prueba: admin / admin123</p>
      </form>
    </div>
  )
}