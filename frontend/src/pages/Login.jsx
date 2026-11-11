import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { iniciarSesion } from '../services/authService'
import { mensajeError } from '../services/api'
import logo from '../assets/logo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await iniciarSesion(email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(mensajeError(err, 'No se pudo iniciar sesión'))
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

        <label>Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="btn primario grande" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}