import api from './api'

const CLAVE_SESION = 'novasalud_sesion'

export async function iniciarSesion(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  const sesion = { token: data.token, usuario: data.usuario }
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  return sesion
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

export function esAdmin() {
  return obtenerSesion()?.usuario?.rol === 'admin'
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}