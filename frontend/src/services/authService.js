import api from './api'

// true = datos de prueba | false = backend real de Josue
const USE_MOCK = true
const CLAVE_SESION = 'novasalud_sesion'

export async function iniciarSesion(usuario, clave) {
  let sesion

  if (USE_MOCK) {
    // Credenciales SOLO de prueba
    if (usuario !== 'admin' || clave !== 'admin123') {
      throw new Error('Usuario o contraseña incorrectos')
    }
    sesion = { token: 'token-de-prueba', usuario: { nombre: 'Administrador' } }
  } else {
    const { data } = await api.post('/auth/login', { usuario, clave })
    sesion = { token: data.token, usuario: data.usuario || { nombre: usuario } }
  }

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

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}