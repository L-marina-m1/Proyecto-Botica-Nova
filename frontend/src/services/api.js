import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3000/api`

const api = axios.create({ baseURL: API_URL })

// Envía el token en cada petición, si hay sesión iniciada
api.interceptors.request.use((config) => {
  try {
    const sesion = JSON.parse(localStorage.getItem('novasalud_sesion'))
    if (sesion?.token) config.headers.Authorization = `Bearer ${sesion.token}`
  } catch {
    // sin sesión
  }
  return config
})

// Si el backend responde 401 (token inválido o vencido), vuelve al login
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('novasalud_sesion')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// Convierte un error de axios en un mensaje legible para el usuario
export function mensajeError(error, porDefecto) {
  if (error.response) {
    const d = error.response.data
    if (d?.detalles?.length) {
      return `${d.mensaje}: ${d.detalles.map((x) => x.mensaje).join(', ')}`
    }
    return d?.mensaje || porDefecto
  }
  if (error.request) return 'No se pudo conectar con el servidor'
  return porDefecto
}

export default api